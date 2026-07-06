import { Router } from 'express';
import { PrismaClient, Terms } from '@prisma/client';
import { NombaService } from '../services/nomba.service';

const router = Router();
const prisma = new PrismaClient();

// Create a dummy batch to act as a settlement basket and provision a VA
router.post('/provision', async (req, res) => {
  try {
    const { amount, reference } = req.body;

    // We need an organization to tie the batch to.
    // In a real app this comes from auth token. We'll find or create a default one for the hackathon.
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Default Organization' }
      });
    }

    // Create the batch acting as a settlement basket
    const batch = await prisma.batch.create({
      data: {
        organization_id: org.id,
        product_name: `Bulk Settlement - ${reference || Date.now()}`,
        quantity: 1,
        declared_terms: Terms.CASH
      }
    });

    // Provision Nomba VA
    const vaResponse = await NombaService.createVirtualAccount(
      batch.id,
      `Settlement ${batch.id.split('-')[0]}`
    );

    // Update batch with VA info
    const updatedBatch = await prisma.batch.update({
      where: { id: batch.id },
      data: {
        nomba_virtual_account_id: vaResponse.virtualAccountId,
        nomba_virtual_account_number: vaResponse.accountNumber,
      }
    });

    res.json({
      id: updatedBatch.id,
      accountNumber: updatedBatch.nomba_virtual_account_number,
      virtualAccountId: updatedBatch.nomba_virtual_account_id,
      status: updatedBatch.status
    });
  } catch (error) {
    console.error('[Settlement Provision Error]', error);
    res.status(500).json({ error: 'Failed to provision virtual account' });
  }
});

// Poll the status of the settlement
router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await prisma.batch.findUnique({
      where: { id },
      select: { status: true }
    });

    if (!batch) {
      return res.status(404).json({ error: 'Settlement not found' });
    }

    res.json({ status: batch.status });
  } catch (error) {
    console.error('[Settlement Status Error]', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

export default router;
