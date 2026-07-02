# PayTrace — Technical Specification

**Audience:** engineering team. This assumes you've read the product brief — this doc is schema, endpoints, state machines, and integration details only.

> ⚠️ **Before implementing any Nomba call below:** field names and endpoint shapes here are based on general patterns and earlier research, not a final API contract. Confirm exact endpoint paths, field names, and payload shapes against Nomba's current developer docs before writing integration code — don't treat the names in this doc as gospel.

---

## 1. System Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Manufacturer Web │     │ Distributor/      │     │ Consumer Verify │
│ Portal           │     │ Retailer App      │     │ Page (no login) │
│ (desktop)        │     │ (mobile web, OTP) │     │                 │
└────────┬─────────┘     └─────────┬─────────┘     └────────┬────────┘
         │                          │                         │
         └──────────────┬───────────┴─────────────────────────┘
                         │
                  ┌──────▼───────┐
                  │  PayTrace API │
                  │   (backend)   │
                  └──────┬───────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                 │
  ┌─────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
  │ Postgres   │   │ Nomba API    │   │ SMS Gateway │
  │ (core DB)  │   │ (VA, Webhook,│   │ (OTP, claim │
  │            │   │ Tx, Transfer)│   │  codes)     │
  └────────────┘   └──────────────┘   └─────────────┘
```

**Suggested stack** (not yet locked — pick based on team familiarity, but these fit the shape of the problem well):
- **Backend:** Node.js/Express or similar — webhook-heavy, I/O-bound workload
- **DB:** Postgres — the allocation tree is naturally a recursive structure (`WITH RECURSIVE` queries work well for lineage walks)
- **Queue:** something simple (BullMQ/Redis, or even a DB-backed job table for MVP) — webhook processing needs to be reliable and idempotent, not synchronous-only
- **Frontend:** any modern framework per surface; the consumer page should be a lightweight, fast-loading SPA or even server-rendered HTML — it's opened from a camera scan on potentially slow connections

---

## 2. Data Model

### `organizations`
| field | type | notes |
|---|---|---|
| id | uuid | |
| name | text | |
| nomba_business_account_id | text | manufacturer's own Nomba account |
| reward_budget_balance | numeric | for consumer payouts |

### `participants`
A person at any tier — distributor, retailer, sub-distributor. Solo actors get one row.

| field | type | notes |
|---|---|---|
| id | uuid | |
| phone_number | text | unique, primary auth identifier |
| bvn | text | encrypted at rest — see §7 |
| nomba_sub_account_id | text | provisioned at onboarding |
| nomba_sub_account_ref | text | the accountRef used when calling Nomba |
| onboarded_at | timestamp | null until BVN-link + top-up complete |

### `batches`
Created by a manufacturer. The root of every allocation tree.

| field | type | notes |
|---|---|---|
| id | uuid | |
| organization_id | uuid | FK → organizations |
| product_name | text | |
| quantity | integer | total units |
| declared_terms | enum | `cash` \| `credit` |
| credit_term_days | integer | null if cash |
| nomba_virtual_account_id | text | |
| nomba_virtual_account_number | text | |
| status | enum | see §3 |
| created_at | timestamp | |
| due_at | timestamp | computed from credit_term_days if credit |

### `allocations`
A handover, or a split of a batch/allocation into a smaller quantity going to a specific participant. **Self-referential — this is the tree.**

| field | type | notes |
|---|---|---|
| id | uuid | |
| batch_id | uuid | FK → batches (root) |
| parent_allocation_id | uuid, nullable | null = first hop directly off the batch |
| from_participant_id | uuid, nullable | null if from organization |
| to_participant_id | uuid | who's receiving this allocation |
| quantity | integer | |
| declared_terms | enum | `cash` \| `credit` |
| credit_term_days | integer | nullable |
| nomba_virtual_account_id | text | this allocation's own VA |
| serial_range_or_ids | jsonb | which serialized units this covers |
| status | enum | see §3 |
| claim_code | text | for SMS-delivered claims, single-use |
| created_at | timestamp | |
| due_at | timestamp | |

### `serialized_units`
One row per physical unit (or per smallest trackable group, e.g. per bag of cement) if you need unit-level lineage. For MVP, this can be a generated range stored as metadata on `allocations` instead of a full row-per-unit table — decide based on whether per-unit QR codes are needed at MVP stage or only per-batch/per-allocation codes.

| field | type | notes |
|---|---|---|
| id | uuid | |
| batch_id | uuid | |
| serial_code | text | unique, this is what's encoded in the QR |
| current_allocation_id | uuid | updated as it moves down the tree |
| consumed_at | timestamp, nullable | set on first successful consumer verification |

### `nomba_transactions`
Local cache of relevant inbound transfers, populated via webhook.

| field | type | notes |
|---|---|---|
| id | uuid | |
| nomba_transaction_id | text | unique, from Nomba |
| virtual_account_id | text | which VA received it |
| amount | numeric | |
| sender_account_name | text | |
| sender_account_number | text | |
| narration | text | best-effort only, never relied on as sole match key |
| matched_allocation_id | uuid, nullable | null until reconciled |
| matched_batch_id | uuid, nullable | |
| match_status | enum | `auto_matched` \| `flagged_mismatch` \| `unmatched` |
| received_at | timestamp | |

### `custody_attestations`
The invisible debit in the credit path.

| field | type | notes |
|---|---|---|
| id | uuid | |
| allocation_id | uuid | |
| participant_id | uuid | who confirmed |
| otp_verified_at | timestamp | |
| nomba_transaction_id | text | the small attestation transfer |
| amount | numeric | small, fixed or near-zero |

### `settlements`
Manual tagging of a real bulk/invoice payment against one or more pending allocations.

| field | type | notes |
|---|---|---|
| id | uuid | |
| nomba_transaction_id | text | the real commercial payment received |
| allocation_ids | uuid[] | which allocations this settles |
| tagged_by_participant_id | uuid | |
| tagged_at | timestamp | |

### `consumer_scans` / `reward_payouts`
| field | type | notes |
|---|---|---|
| id | uuid | |
| serial_code | text | |
| result | enum | `genuine` \| `duplicate_claim` \| `chain_mismatch` \| `unrecognized` |
| scanner_phone | text | for reward payout + rate limiting |
| reward_amount | numeric, nullable | higher for caught counterfeits |
| paid_at | timestamp, nullable | |

---

## 3. Status / State Machine

**Batch and Allocation status enum:**
```
PENDING
PAYMENT_VERIFIED
CUSTODY_CONFIRMED
SETTLED
PARTIALLY_VERIFIED
FLAGGED
```

**Transitions:**

| From | Trigger | To |
|---|---|---|
| `PENDING` | webhook: matched inbound transfer, amount + sender match expected | `PAYMENT_VERIFIED` |
| `PENDING` | webhook: matched inbound transfer, amount < expected | `PARTIALLY_VERIFIED` |
| `PENDING` | webhook: inbound transfer, sender/amount mismatch | `FLAGGED` (manual review queue) |
| `PENDING` | declared `credit`, due window not yet reached, OTP-confirmed scan occurs | `CUSTODY_CONFIRMED` |
| `PENDING` | declared `cash`, due window passes, no payment | `FLAGGED` (anomaly: declared cash, nothing received) |
| `CUSTODY_CONFIRMED` | settlement tagged against this allocation | `SETTLED` |
| `CUSTODY_CONFIRMED` | a real batch-matched payment arrives anyway | `PAYMENT_VERIFIED` (real evidence always overrides) |
| `FLAGGED` | manual resolution by manufacturer | back to appropriate status, with audit note |

**Important implementation rule:** status transitions should be append-only events (an `allocation_status_events` table), not just an overwritten column — you want the full history for the audit trail and for judges/demo purposes, not just the current state.

---

## 4. API Endpoints

### Manufacturer-facing
```
POST   /api/batches                          create batch, provisions VA
GET    /api/batches                          list, filterable by status
GET    /api/batches/:id                      detail
GET    /api/batches/:id/tree                 full allocation tree (recursive)
GET    /api/batches/flags                    all flagged items across batches
POST   /api/batches/:id/flags/:flagId/resolve
GET    /api/receivables                      aging view across credit allocations
```

### Distributor/Retailer-facing
```
POST   /api/auth/otp/request                 { phone }
POST   /api/auth/otp/verify                  { phone, code } → session token
POST   /api/onboarding/link-bvn              { bvn } → triggers Nomba sub-account provisioning
POST   /api/onboarding/topup-confirm         webhook target or polling for the one-time top-up
GET    /api/allocations/incoming             pending claims for this participant
POST   /api/allocations/:id/claim/cash       mark "I've paid", awaiting webhook confirmation
POST   /api/allocations/:id/claim/credit     { otp } → triggers invisible attestation debit
POST   /api/allocations                      create sub-allocation (forward to next party)
        { parent_allocation_id, to_phone, quantity, declared_terms, credit_term_days }
POST   /api/settlements                      { nomba_transaction_id, allocation_ids[] }
GET    /api/allocations/history              full audit trail for this participant
```

### Consumer-facing (no auth)
```
GET    /api/verify/:serial_code              returns chain + genuine/failed result
POST   /api/verify/:serial_code/claim-reward { phone }
POST   /api/verify/:serial_code/report       { phone, location, notes }
```

### Internal
```
POST   /api/webhooks/nomba/transfer-received   signature-verified, idempotent
POST   /api/webhooks/nomba/transfer-sent        for attestation/reward payout confirmations
```

---

## 5. Nomba Integration Details

### 5.1 Virtual Account creation (per batch, and per allocation)
Called whenever a batch or sub-allocation is created. Expected fields to pass (verify exact names against current docs):
- `accountRef` — use the batch/allocation's internal UUID
- `accountName` — e.g. `"PayTrace - Batch {id}"` or the manufacturer's display name
- `bvn` — required for participant-level sub-accounts; optional/not applicable for pure batch VAs owned by the manufacturer
- `currency` — NGN

Store the returned dedicated account number + Nomba's internal account/holder ID against the batch or allocation row.

### 5.2 Webhook handling (`transfer.received`)
On receipt:
1. Verify webhook signature (don't process unverified payloads).
2. Look up which VA received it by Nomba account ID, not by narration alone.
3. Pull `amount`, `senderAccountName`, `senderAccountNumber`, `transactionId`, `narration` (narration is supplementary only — never the sole match key, per the design correction from the narration-fragility issue).
4. Run the matching logic in §5.4.
5. Write to `nomba_transactions`, update allocation/batch status, emit any flags.
6. **Idempotency:** webhooks can be retried by the provider — dedupe on `nomba_transaction_id` before processing.

### 5.3 Transactions API
Used at consumer-verification time to pull a VA's statement as the audit-trail source of truth, and on the manufacturer dashboard for the Batch Detail / Custody Tree view. Cache aggressively — don't hit this live on every consumer scan; rely on the webhook-populated local table as the primary read path, and use the Transactions API as a periodic reconciliation/backfill check.

### 5.4 Matching/reconciliation logic (pseudocode)
```
on transfer_received(payload):
  va = find_virtual_account(payload.accountNumber)
  if va is None: log_orphan_transfer(payload); return

  expected = get_pending_allocation_or_batch(va)
  if expected is None: flag_unexpected_payment(va, payload); return

  if abs(payload.amount - expected.amount) < TOLERANCE:
      if sender_matches_expected_party(payload, expected):
          mark_payment_verified(expected, payload.transactionId)
      else:
          flag_mismatch(expected, payload, reason="sender_mismatch")
  elif payload.amount < expected.amount:
      mark_partially_verified(expected, payload)
  else:
      flag_mismatch(expected, payload, reason="amount_mismatch")
```

### 5.5 Transfer/Disbursement API
Two distinct uses — keep them as separate service functions even if they call the same underlying Nomba endpoint:
- **Attestation debit:** small, fixed amount, from a participant's sub-account into the relevant allocation's VA, triggered server-side after OTP verification. The participant never sees this happen.
- **Consumer reward payout:** from the manufacturer's reward budget (or a platform-level pooled account) to the scanner's phone-linked destination, triggered after a verification scan. Apply the cap/rate-limit rules from §3 of the product doc before calling this.

---

## 6. QR / Serial Identity Design

- Each serial code should encode a signed token (JWT or equivalent), not just a raw incrementing ID — minimum payload: `{ batch_id, allocation_id (if applicable), issued_at, issuer_signature }`.
- **Signing key ownership:** decide whether keys are per-manufacturer (stronger isolation, more key management overhead) or platform-level (simpler, but a single compromised key affects every manufacturer). Per-manufacturer is the more defensible claim for the "unforgeability" story.
- **Replay/duplicate-claim protection:** `serialized_units.consumed_at` (or an equivalent flag) must be set atomically on first successful consumer verification — use a DB transaction with a unique constraint, not a check-then-set pattern, to avoid a race where two near-simultaneous scans both pass.

---

## 7. Security & Compliance Notes

- **BVN is sensitive personal data** — encrypt at rest, restrict read access, and don't log it in plaintext anywhere (application logs, error tracking, etc.).
- **OTP endpoints** need rate limiting per phone number, independent of the general API rate limits — this is a common abuse vector.
- **Reward payout abuse:** cap per serial (already-consumed check) and per phone per day; consider a velocity check (same phone scanning many serials in a short window) as an additional flag.
- **Webhook endpoint:** must verify Nomba's signature on every request, and should not be guessable/unauthenticated — treat it as a public attack surface even though it's "internal."

---

## 8. Build Order Suggestion (matches the hackathon sprint goals)

1. Core schema + batch creation + VA provisioning (no reconciliation yet)
2. Webhook receiver + matching logic for the cash path
3. Participant onboarding (BVN link + sub-account + top-up) + OTP custody confirmation for the credit path
4. Sub-allocation creation (recursive tree) — start with depth 2 (manufacturer → distributor → retailer) before generalizing
5. Consumer verification endpoint + lineage walk query
6. Reward payout integration
7. Manufacturer dashboard views (tree, flags, receivables) — can be built in parallel with 4–6 once the schema is stable
