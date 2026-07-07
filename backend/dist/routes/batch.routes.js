"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const nomba_service_1 = require("../services/nomba.service");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Create new batch
router.post('/', async (req, res) => {
    try {
        const { organization_id, product_name, quantity, declared_terms, credit_term_days } = req.body;
        let org = await prisma.organization.findFirst();
        if (!org) {
            org = await prisma.organization.create({ data: { name: 'Default Organization' } });
        }
        const batch = await prisma.batch.create({
            data: {
                organization_id: org.id,
                product_name,
                quantity: parseInt(quantity, 10),
                declared_terms: declared_terms.toUpperCase(),
                credit_term_days: credit_term_days ? parseInt(credit_term_days, 10) : null
            }
        });
        // Provision Nomba VA
        const vaResponse = await nomba_service_1.NombaService.createVirtualAccount(batch.id, `PayTrace - Batch ${product_name}`);
        // Update batch with VA info
        const updatedBatch = await prisma.batch.update({
            where: { id: batch.id },
            data: {
                nomba_virtual_account_id: vaResponse.virtualAccountId,
                nomba_virtual_account_number: vaResponse.accountNumber,
            }
        });
        res.json(updatedBatch);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create batch' });
    }
});
router.get('/', async (req, res) => {
    const batches = await prisma.batch.findMany({ include: { organization: true } });
    res.json(batches);
});
exports.default = router;
