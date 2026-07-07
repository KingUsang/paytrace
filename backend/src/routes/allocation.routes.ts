import { Router } from 'express';
import { PrismaClient, Terms } from '@prisma/client';
import { NombaService } from '../services/nomba.service';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get all allocations (or filter by participant/status)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, to_participant_id } = req.query;
    
    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (to_participant_id) whereClause.to_participant_id = to_participant_id;

    if (req.user?.role === 'distributor') {
      whereClause.OR = [
        { to_participant_id: req.user.id },
        { from_participant_id: req.user.id }
      ];
    }

    const allocations = await prisma.allocation.findMany({
      where: whereClause,
      include: {
        batch: true,
        from_participant: true,
        to_participant: true,
      },
      orderBy: { created_at: 'desc' }
    });
    
    res.json(allocations);
  } catch (error) {
    console.error('[Get Allocations Error]', error);
    res.status(500).json({ error: 'Failed to fetch allocations' });
  }
});

// Get a single allocation by ID
router.get('/:id', async (req, res) => {
  try {
    const allocation = await prisma.allocation.findUnique({
      where: { id: req.params.id },
      include: {
        batch: true,
        from_participant: true,
        to_participant: true,
      }
    });
    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found' });
    }
    res.json(allocation);
  } catch (error) {
    console.error('[Get Allocation Error]', error);
    res.status(500).json({ error: 'Failed to fetch allocation' });
  }
});

// Create an allocation (Beat 3)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { batch_id, to_phone_number, quantity, declared_terms, credit_term_days } = req.body;
    
    let actualBatchId = batch_id;
    let parentAllocationId = null;

    // Check if the provided ID is an allocation ID (sub-allocation)
    const parentAlloc = await prisma.allocation.findUnique({ where: { id: batch_id } });
    if (parentAlloc) {
      actualBatchId = parentAlloc.batch_id;
      parentAllocationId = parentAlloc.id;
    }

    // 1. Find or create the target participant (Retailer or Distributor)
    let toParticipant = await prisma.participant.findUnique({
      where: { phone_number: to_phone_number }
    });

    if (!toParticipant) {
      toParticipant = await prisma.participant.create({
        data: {
          phone_number: to_phone_number,
          // Generate a simple claim code for testing
          password: 'password123'
        }
      });
    }

    // 2. Generate a random claim code (OTP) for Beat 4
    const claimCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Create the Allocation
    const allocation = await prisma.allocation.create({
      data: {
        batch_id: actualBatchId,
        parent_allocation_id: parentAllocationId,
        from_participant_id: req.user?.id,
        to_participant_id: toParticipant.id,
        quantity: parseInt(quantity, 10),
        declared_terms: declared_terms.toUpperCase() as Terms,
        credit_term_days: credit_term_days ? parseInt(credit_term_days, 10) : null,
        claim_code: claimCode,
        status: 'PENDING'
      }
    });

    // 4. Provision a Sub-Account Virtual Account for this Allocation (Beat 3)
    const vaResponse = await NombaService.createVirtualAccount(
      allocation.id,
      `Alloc ${allocation.id.split('-')[0]}`
    );

    // 5. Update Allocation with VA details
    const updatedAllocation = await prisma.allocation.update({
      where: { id: allocation.id },
      data: {
        nomba_virtual_account_id: vaResponse.virtualAccountId,
        nomba_virtual_account_number: vaResponse.accountNumber,
      }
    });

    res.json(updatedAllocation);
  } catch (error) {
    console.error('[Create Allocation Error]', error);
    res.status(500).json({ error: 'Failed to create allocation' });
  }
});

// Retailer confirms custody via OTP (Beat 4)
router.post('/confirm', async (req, res) => {
  try {
    const { allocation_id, claim_code } = req.body;

    const allocation = await prisma.allocation.findUnique({
      where: { id: allocation_id }
    });

    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });
    if (allocation.claim_code !== claim_code && claim_code !== '123456') { // Allow 123456 as a master backdoor for testing
      return res.status(400).json({ error: 'Invalid OTP code' });
    }

    // Update status to CUSTODY_CONFIRMED
    const updated = await prisma.allocation.update({
      where: { id: allocation_id },
      data: { status: 'CUSTODY_CONFIRMED' }
    });

    // Record attestation
    await prisma.custodyAttestation.create({
      data: {
        allocation_id: updated.id,
        participant_id: updated.to_participant_id,
      }
    });

    // In a real production flow with Nomba Transfers API, we would execute a micro-transfer here from the retailer's wallet.
    // For this hackathon step, we successfully flip the status to visually represent Beat 4.
    
    res.json(updated);
  } catch (error) {
    console.error('[Confirm Allocation Error]', error);
    res.status(500).json({ error: 'Failed to confirm custody' });
  }
});

// Hackathon Demo: Simulate Webhook Payment by doing a real API transfer!
router.post('/:id/simulate-payment', async (req, res) => {
  try {
    const allocation = await prisma.allocation.findUnique({
      where: { id: req.params.id },
      include: { batch: true }
    });

    if (!allocation) return res.status(404).json({ error: 'Allocation not found' });

    // 1. Actually call the Nomba API to register the money movement!
    const targetAccount = allocation.nomba_virtual_account_number || allocation.batch.nomba_virtual_account_number;
    const amount = allocation.quantity * Number(allocation.batch.unit_price || 50);
    
    if (targetAccount) {
      // Execute the real API call to Nomba
      await NombaService.transferFunds(amount, targetAccount, `Payment for Batch ${allocation.batch.id}`);
    }

    // 2. Update custody status
    const updated = await prisma.allocation.update({
      where: { id: req.params.id },
      data: { status: 'CUSTODY_CONFIRMED' }
    });
    
    res.json(updated);
  } catch (error) {
    console.error('[Simulate Payment Error]', error);
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

export default router;
