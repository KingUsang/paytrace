import { Router } from 'express';
import { PrismaClient, Terms } from '@prisma/client';
import { NombaService } from '../services/nomba.service';

const router = Router();
const prisma = new PrismaClient();

// Create new batch
router.post('/', async (req, res) => {
  try {
    const { organization_id, product_name, quantity, declared_terms, credit_term_days } = req.body;

    const batch = await prisma.batch.create({
      data: {
        organization_id,
        product_name,
        quantity,
        declared_terms: declared_terms as Terms,
        credit_term_days
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
