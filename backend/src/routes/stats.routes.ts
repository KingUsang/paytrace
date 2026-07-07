import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get global manufacturer stats (Only allowed for manufacturers)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'manufacturer') {
      return res.status(403).json({ error: 'Forbidden: Only manufacturers can view global stats' });
    }

    // Total Settled Value: Sum of all PAID/SETTLED allocations
    // For simplicity, we'll sum allocations where status = PAYMENT_VERIFIED
    const settledAllocations = await prisma.allocation.findMany({
      where: {
        status: 'PAYMENT_VERIFIED'
      },
      include: {
        batch: { select: { unit_price: true } }
      }
    });

    const totalSettledValue = settledAllocations.reduce((acc, alloc) => {
      const val = alloc.quantity * Number(alloc.batch.unit_price || 50);
      return acc + val;
    }, 0);

    // Counterfeits Blocked: Count of DUPLICATE_CLAIM scans
    const counterfeitsBlocked = await prisma.consumerScan.count({
      where: {
        result: 'DUPLICATE_CLAIM'
      }
    });

    // Total Receivables (Let's make it the sum of all batches for the dashboard)
    const allBatches = await prisma.batch.findMany();
    const totalReceivables = allBatches.reduce((acc, b) => acc + (b.quantity * Number(b.unit_price || 50)), 0);

    const totalBatches = await prisma.batch.count();
    const paymentVerified = await prisma.allocation.count({ where: { status: 'PAYMENT_VERIFIED' } });
    const custodyConfirmed = await prisma.allocation.count({ where: { status: 'CUSTODY_CONFIRMED' } });
    const overdueAlerts = await prisma.allocation.count({ where: { status: 'PENDING' } });

    // Scans
    const recentScans = await prisma.itemScan.findMany({
      orderBy: { scanned_at: 'desc' },
      take: 5
    });
    
    const securityAlerts = await prisma.itemScan.findMany({
      where: { result: 'FLAGGED' },
      orderBy: { scanned_at: 'desc' },
      take: 5
    });

    res.json({
      totalSettledValue,
      counterfeitsBlocked,
      totalBatches,
      paymentVerified,
      custodyConfirmed,
      totalReceivables,
      overdueAlerts,
      recentScans,
      securityAlerts
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
