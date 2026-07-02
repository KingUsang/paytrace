# PayTrace — Product Requirements Document (PRD)

**Stage:** Hackathon MVP — DevCareer x Nomba Hackathon 2026
**Status:** Draft for build sprint
**Last updated:** June 28, 2026

---

## 1. Overview

PayTrace is a financial accountability and anti-counterfeiting layer for Nigerian supply chains, built on Nomba's payment infrastructure. Every product batch gets a unique, tamper-proof identity. As that batch moves from manufacturer to distributor to retailer to shelf, every handover produces a real, auditable transaction on Nomba's ledger — either a genuine commercial payment (cash sales) or a small, BVN-verified attestation transaction (credit sales). A consumer scanning the final product sees the full verified chain of custody and learns instantly whether it's genuine, earning an instant reward for checking.

This document defines what needs to be built for the hackathon MVP, for whom, and how we'll know it works.

---

## 2. Goals

### 2.1 Product goals
- Give manufacturers a verifiable, regulated-ledger answer to "who is currently accountable for this batch" — something neither pure-authenticity tools (Chekkit, NAFDAC MAS) nor pure-payments tools (Omni, Duplo) currently provide.
- Make that verification free and frictionless for everyone downstream of the manufacturer (distributors, retailers, consumers) — no app install, no bank app required beyond a one-time onboarding step.
- Ensure every part of the product's value depends on Nomba's APIs, not just the parts that were convenient to route through it.

### 2.2 Hackathon-specific goals
- Ship a working, end-to-end demo within the build window: manufacturer creates a batch → distributor receives it on a cash basis → retailer receives a sub-allocation on credit terms → consumer scans the final unit and sees a correctly differentiated chain, with a reward paid out.
- Satisfy the **Persistent Dedicated Virtual Account System** track criteria (provisioning, reconciliation, statements, misdirected-payment handling) as primary, and the **KYC-gated payment flow** track criteria as secondary.
- All Nomba integration code written and committed strictly within the official hackathon dates — no pre-built integration work.

### 2.3 Success metrics (for the demo/submission, not long-term business metrics)
- A full chain (≥3 hops, mixing at least one cash and one credit handover) completes without manual database intervention.
- A deliberately duplicated/forged QR is correctly rejected at consumer verification.
- A deliberately mismatched payment (wrong amount or wrong sender) is correctly flagged, not silently accepted.
- Reward payout fires automatically and correctly on a real scan, with the higher reward visibly paid on the rejected/counterfeit scan.

---

## 3. Personas

| Persona | Who they are | What they need | Current pain |
|---|---|---|---|
| **Manufacturer Admin** | Ops/finance lead at a mid-size manufacturer (cement, agrochemicals, paints, lubricants) | Know which batches are paid, which are outstanding, which are at risk of counterfeiting or diversion | No independently verifiable record of custody or payment status across a multi-tier distribution network |
| **Distributor** | First-tier buyer, often on credit terms, splits inventory across multiple retailers | A fast, low-friction way to confirm receipt and forward inventory without needing a bank app or new hardware | Manual, trust-based handover with no record if a dispute arises |
| **Retailer** | Smallest-volume downstream party, sells to the public | Same as distributor, smaller scale | Same as distributor |
| **Consumer** | End buyer of the physical product | A fast way to know if what they're buying is genuine | No reliable, free way to verify authenticity at point of purchase |

---

## 4. Scope

### In scope for hackathon MVP
- Batch creation with Nomba virtual account provisioning
- Cash-path verification (real payment matched to a batch/allocation)
- Credit-path verification (BVN-linked onboarding, OTP-confirmed custody attestation)
- Recursive allocation (at least 2 levels deep: manufacturer → distributor → retailer)
- Manual settlement tagging (bulk payment against pending allocations)
- Flagging for mismatched/misdirected payments
- Consumer verification page with chain lineage display
- Consumer reward payout (basic version — fixed amounts, simple rate limiting)
- Manufacturer dashboard: batch list, batch detail/tree, flags, basic receivables view

### Explicitly out of scope for MVP
- Multi-currency support
- Refunds/reversal flows for incorrect attestation debits
- Full dispute-resolution workflow (UI beyond flag-and-manual-resolve)
- Manufacturer's own billing/subscription management for PayTrace's SaaS fee
- Allocation depth beyond 2–3 tiers (architecture supports it; demo doesn't need to prove unlimited depth)
- Non-Nigerian markets, non-NGN currencies, non-BVN identity schemes
- Native mobile apps (mobile web only)

---

## 5. Functional Requirements (by Epic)

### Epic 1 — Batch Management
**US-1.1:** As a Manufacturer Admin, I want to create a batch with declared payment terms (cash or credit + term length), so the system knows what to expect.
- AC: Batch creation triggers a Nomba virtual account provisioning call.
- AC: Batch is created with status `PENDING`.
- AC: If credit is declared, a `due_at` date is computed and stored.

**US-1.2:** As a Manufacturer Admin, I want to see a list of all my batches filterable by status, so I can monitor what needs attention.
- AC: List supports filtering by `PENDING`, `PAYMENT_VERIFIED`, `CUSTODY_CONFIRMED`, `SETTLED`, `FLAGGED`.

**US-1.3:** As a Manufacturer Admin, I want to view a batch's full custody tree, so I can see every sub-allocation and its status.
- AC: Tree view renders parent → child allocations with current status per node.

### Epic 2 — Payment Verification (Cash Path)
**US-2.1:** As the system, when an inbound transfer lands on a batch/allocation's virtual account, I want to attempt to match it automatically.
- AC: Match attempted on amount + sender identity, not narration alone.
- AC: Exact match → status becomes `PAYMENT_VERIFIED`.
- AC: Amount lower than expected → `PARTIALLY_VERIFIED`.
- AC: Sender or amount mismatch → `FLAGGED`, with the reason recorded.

**US-2.2:** As a Manufacturer Admin, I want to see and resolve flagged payments, so unmatched or suspicious transfers don't sit unexplained.
- AC: Flag list shows transaction details and the reason for the flag.
- AC: Resolving a flag requires a recorded action (not a silent dismiss).

### Epic 3 — Participant Onboarding (KYC)
**US-3.1:** As a Distributor/Retailer, the first time I'm added to any chain, I want a one-time onboarding step, so my later confirmations are tied to a verified identity.
- AC: Onboarding requires phone OTP verification + BVN entry.
- AC: A Nomba sub-account is provisioned and linked to the BVN.
- AC: A small real top-up is required before onboarding is marked complete.
- AC: This step only happens once per participant, not per handover.

### Epic 4 — Custody Confirmation (Credit Path)
**US-4.1:** As a Distributor/Retailer receiving goods on credit terms, I want to confirm receipt with just a scan and a code, so I don't need a bank app for every handover.
- AC: Scan + OTP triggers a small, real debit from the participant's own onboarded sub-account into the allocation's virtual account — invisible to the user.
- AC: Status becomes `CUSTODY_CONFIRMED` on success.
- AC: If a real commercial payment is later matched to the same allocation, status upgrades to `PAYMENT_VERIFIED` regardless of the existing `CUSTODY_CONFIRMED` state.

### Epic 5 — Allocation / Forwarding
**US-5.1:** As a Distributor, I want to split my received inventory across multiple retailers, so I can forward different quantities to different parties.
- AC: Creating an allocation requires: parent allocation/batch, recipient phone, quantity ≤ available unallocated pool, declared terms.
- AC: Each new allocation gets its own virtual account.
- AC: Available pool correctly decrements as allocations are created.

**US-5.2:** As a Distributor, I want to see my current available inventory pool, so I know what I haven't yet forwarded.
- AC: Pool = received quantity minus sum of all child allocations' quantities.

### Epic 6 — Settlement Tagging
**US-6.1:** As a Distributor/Retailer, when I make a bulk commercial payment, I want to tag which pending allocations it covers, so the record reflects real-world invoicing without relying on fragile narration parsing.
- AC: User selects a real Nomba transaction and one or more pending `CUSTODY_CONFIRMED` allocations to apply it against.
- AC: Tagged allocations move to `SETTLED`.

### Epic 7 — Consumer Verification
**US-7.1:** As a Consumer, I want to scan a product's QR code and immediately see whether it's genuine, so I can make an informed purchase decision.
- AC: Scanning resolves the serial code's lineage from unit → allocation → batch.
- AC: Each hop in the displayed chain is labeled with its evidentiary tier (Payment Verified vs. Custody Confirmed), visually distinct.
- AC: A duplicate claim (already-consumed serial) returns a clear failure state, not a silent pass.
- AC: A chain mismatch (final custodian doesn't match expected) returns a clear failure state.

**US-7.2:** As a Consumer, I want to report a suspected counterfeit, so the manufacturer is alerted.
- AC: Report captures phone number, optional location, optional notes, and is linked to the failed scan event.

### Epic 8 — Consumer Rewards
**US-8.1:** As a Consumer, I want a small reward for verifying a product, so I'm motivated to check.
- AC: Reward triggers automatically via Nomba disbursement after a scan resolves.
- AC: Reward is capped to one payout per serial code (tied to first-ever scan).
- AC: Reward is rate-limited per phone number per day.
- AC: Reward amount is higher for a scan that catches a counterfeit than for one confirming a genuine product.

### Epic 9 — Manufacturer Dashboard & Reporting
**US-9.1:** As a Manufacturer Admin, I want a receivables/aging view of credit-based allocations, so I can see what's overdue.
- AC: View lists `CUSTODY_CONFIRMED` allocations sorted by days-until-due or days-overdue.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Security** | BVN encrypted at rest; never logged in plaintext. Webhook signatures verified on every inbound call. OTP endpoints rate-limited independently of general API limits. |
| **Reliability** | Webhook processing must be idempotent (dedupe on Nomba transaction ID) — providers can and do retry deliveries. |
| **Performance** | Consumer verification page should resolve from a cached local read path, not a live Nomba API call on every scan, to keep load times acceptable on slow mobile connections. |
| **Compliance** | Virtual accounts for participants must be linked to a BVN, per CBN requirements. |
| **Usability** | Distributor/retailer app must function on low-end devices and slow connections — minimal payload sizes, no heavy client-side frameworks required for core flows. |
| **Auditability** | All status transitions are recorded as append-only events, not just an overwritten current-status field — needed for both dispute resolution and demo credibility. |

---

## 7. Assumptions & Dependencies

- Nomba sandbox/API credentials are available to the team for the duration of the build window.
- An SMS gateway is available and budgeted for OTP delivery and claim-code notifications.
- At least one manufacturer "test organization" with sample batch data exists for demoing the full chain.
- BVN verification can be performed against Nomba's onboarding flow within the hackathon timeframe (verify this isn't a multi-day external approval process before committing the schedule to it).

---

## 8. Risks

(Full detail in the technical spec's risk section — summarized here for product visibility.)

- Consumer adoption of scanning may be low without the incentive layer; the reward mechanism is treated as required, not optional, for this reason.
- BVN/OTP-based identity is not unforgeable (SIM swap risk) — described as "BVN-verified," not "unforgeable," in all user-facing copy.
- Declared payment terms rely on manufacturer honesty at batch creation; mitigated by treating mismatches as flagged anomalies, not silent reclassification.

---

## 9. Milestones (remaining build window)

| Phase | Target |
|---|---|
| Week 1 | Schema finalized, batch creation + VA provisioning working, webhook receiver scaffolded |
| Week 2 | Cash-path reconciliation complete; participant onboarding (BVN + sub-account) working; credit-path OTP confirmation working |
| Week 3 | Recursive allocation (2 levels), settlement tagging, flagging/mismatch handling |
| Week 4 | Consumer verification page, reward payout, manufacturer dashboard views |
| Final days | End-to-end demo rehearsal, edge-case testing (duplicate claim, mismatch, partial payment), submission prep |

Adjust against the actual hackathon calendar (build sprint running within the June 8 – July 18, 2026 window) as your team's actual start date and velocity dictate.

---

## 10. Open Questions

- Fresh virtual account per allocation vs. reusing participants' existing sub-accounts at scale — demo favors the former; production favors evaluating cost/latency of the latter.
- Exact reward amounts (genuine vs. counterfeit-catch) — needs a number before the demo script is finalized.
- Whether per-unit serialization (one row per physical unit) is needed for the demo, or whether per-allocation tracking is sufficient to tell a convincing story.

---

## 11. Glossary

- **Payment Verified** — strongest evidentiary tier; a real commercial payment was matched to this exact batch/allocation.
- **Custody Confirmed** — real but weaker tier; no commercial payment yet (credit sale), but handover was confirmed by a BVN-verified person via OTP, backed by a small real attestation transaction.
- **Settled** — a custody-confirmed allocation that has since had a real bulk/invoice payment manually tagged against it.
- **Allocation** — a handover or split of a batch into a smaller quantity assigned to a specific participant; allocations form a tree rooted at the original batch.
- **Attestation transaction** — the small, invisible debit triggered by an OTP-confirmed scan in the credit path, proving identity-linked custody acknowledgment without representing the commercial sale itself.
