"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const nomba_service_1 = require("../services/nomba.service");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/nomba/transfer-received', async (req, res) => {
    const signature = req.headers['x-nomba-signature'];
    if (!nomba_service_1.NombaService.validateWebhookSignature(JSON.stringify(req.body), signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    const payload = req.body;
    // Payload expected: { transactionId, accountNumber, amount, senderAccountName, senderAccountNumber, narration }
    try {
        // 1. Dedupe check (Idempotency)
        const existingTx = await prisma.nombaTransaction.findUnique({
            where: { nomba_transaction_id: payload.transactionId }
        });
        if (existingTx) {
            return res.status(200).json({ message: 'Already processed' });
        }
        // 2. Find VA target
        // Check batches first
        let target = null;
        let type = 'BATCH';
        let batch = await prisma.batch.findFirst({
            where: { nomba_virtual_account_number: payload.accountNumber }
        });
        if (batch) {
            target = batch;
        }
        else {
            let allocation = await prisma.allocation.findFirst({
                where: { nomba_virtual_account_number: payload.accountNumber }
            });
            if (allocation) {
                target = allocation;
                type = 'ALLOCATION';
            }
        }
        if (!target) {
            // Orphan transfer
            await prisma.nombaTransaction.create({
                data: {
                    nomba_transaction_id: payload.transactionId,
                    virtual_account_id: payload.accountNumber,
                    amount: payload.amount,
                    sender_account_name: payload.senderAccountName,
                    sender_account_number: payload.senderAccountNumber,
                    narration: payload.narration,
                    match_status: 'unmatched'
                }
            });
            return res.status(200).json({ message: 'Logged as unmatched orphan' });
        }
        // 3. Matching logic (naive for MVP)
        let matchStatus = 'auto_matched';
        let newStatus = client_1.Status.PAYMENT_VERIFIED;
        // TODO: Add complex tolerance checking later
        // For now, assume it's auto-matched
        const tx = await prisma.nombaTransaction.create({
            data: {
                nomba_transaction_id: payload.transactionId,
                virtual_account_id: payload.accountNumber,
                amount: payload.amount,
                sender_account_name: payload.senderAccountName,
                sender_account_number: payload.senderAccountNumber,
                narration: payload.narration,
                match_status: matchStatus,
                ...(type === 'BATCH' ? { matched_batch_id: target.id } : { matched_allocation_id: target.id })
            }
        });
        // 4. Update status
        if (type === 'BATCH') {
            await prisma.batch.update({
                where: { id: target.id },
                data: { status: newStatus }
            });
        }
        else {
            await prisma.allocation.update({
                where: { id: target.id },
                data: { status: newStatus }
            });
        }
        res.status(200).json({ message: 'Processed successfully', tx });
    }
    catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
