import { Router } from 'express';
import { PrismaClient, Terms } from '@prisma/client';
import { NombaService } from '../services/nomba.service';

const router = Router();
const prisma = new PrismaClient();

// Create new batch
router.post('/', async (req, res) => {
  try {
    const { organization_id, product_name, quantity, declared_terms, credit_term_days, unit_price } = req.body;

    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({ data: { name: 'Default Organization' } });
    }

    const batch = await prisma.batch.create({
      data: {
        organization_id: org.id,
        product_name,
        quantity: parseInt(quantity, 10),
        declared_terms: declared_terms.toUpperCase() as Terms,
        credit_term_days: credit_term_days ? parseInt(credit_term_days, 10) : null,
        unit_price: unit_price ? parseFloat(unit_price) : 0.0
      }
    });

    // Provision Nomba VA
    const vaResponse = await NombaService.createVirtualAccount(
      batch.id,
      `PayTrace - Batch ${product_name}`
    );

    // Update batch with VA info
    const updatedBatch = await prisma.batch.update({
      where: { id: batch.id },
      data: {
        nomba_virtual_account_id: vaResponse.virtualAccountId,
        nomba_virtual_account_number: vaResponse.accountNumber,
      }
    });

    // Auto-allocate to default distributor for the demo flow
    const distributorPhone = '+2348000000000';
    const distributor = await prisma.participant.findUnique({ where: { phone_number: distributorPhone } });
    if (distributor) {
      await prisma.allocation.create({
        data: {
          batch_id: batch.id,
          to_participant_id: distributor.id,
          quantity: parseInt(quantity, 10),
          declared_terms: declared_terms.toUpperCase() as Terms,
          credit_term_days: credit_term_days ? parseInt(credit_term_days, 10) : null,
          status: 'PENDING'
        }
      });
    }

    res.json(updatedBatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

router.get('/', async (req, res) => {
  const batches = await prisma.batch.findMany({ include: { organization: true } });
  res.json(batches);
});

export default router;
