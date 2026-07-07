import { Router } from 'express';
import { PrismaClient, ScanResult } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Consumer scans a product (Beat 5 & 6)
router.get('/scan/:serial', async (req, res) => {
  try {
    const { serial } = req.params;
    
    // We treat the "serial" as an allocation ID for simplicity in the hackathon,
    // which represents the final leg of custody.
    const allocation = await prisma.allocation.findUnique({
      where: { id: serial },
      include: {
        batch: {
          include: { organization: true }
        },
        from_participant: true,
        to_participant: true,
      }
    });

    if (!allocation) {
      // Unrecognized counterfeit
      await prisma.consumerScan.create({
        data: { serial_code: serial, result: 'UNRECOGNIZED', scanner_phone: 'anonymous' }
      });
      return res.status(404).json({ error: 'Product unrecognized', result: 'UNRECOGNIZED' });
    }

    // Check if it was already scanned (Counterfeit Catch - Beat 6)
    const existingScan = await prisma.consumerScan.findFirst({
      where: { serial_code: serial, result: 'GENUINE' }
    });

    if (existingScan) {
      // Duplicate claim detected
      await prisma.consumerScan.create({
        data: { serial_code: serial, result: 'DUPLICATE_CLAIM', scanner_phone: 'anonymous', reward_amount: 50.00 } // Higher reward for catching fake
      });
      
      return res.json({
        result: 'DUPLICATE_CLAIM',
        message: 'This product has already been verified previously. Suspected duplicate/counterfeit.',
        reward_amount: 50.00,
        original_scan_date: existingScan.paid_at || existingScan.id
      });
    }

    // Genuine Scan (Beat 5)
    await prisma.consumerScan.create({
      data: { 
        serial_code: serial, 
        result: 'GENUINE', 
        scanner_phone: 'anonymous',
        reward_amount: 10.00,
        paid_at: new Date()
      }
    });

    // Build the lineage
    const lineage = [
      {
        tier: 'Factory',
        name: allocation.batch.organization.name,
        status: 'Origin'
      }
    ];

    if (allocation.from_participant) {
      lineage.push({
        tier: 'Distributor',
        name: `User ${allocation.from_participant.phone_number}`,
        status: allocation.batch.status === 'PAYMENT_VERIFIED' ? 'Payment Verified' : 'Custody Confirmed'
      });
    }

    lineage.push({
      tier: 'Retailer',
      name: `User ${allocation.to_participant.phone_number}`,
      status: allocation.status === 'CUSTODY_CONFIRMED' ? 'Custody Confirmed' : 'Pending'
    });

    res.json({
      result: 'GENUINE',
      product_name: allocation.batch.product_name,
      lineage,
      reward_amount: 10.00
    });

  } catch (error) {
    console.error('[Consumer Scan Error]', error);
    res.status(500).json({ error: 'Failed to process scan' });
  }
});

// Execute a REAL Nomba Transfer for the Consumer Reward!
router.post('/claim-reward', async (req, res) => {
  try {
    const { phone, serial, amount } = req.body;
    
    // In a real app, we would look up the Nomba wallet tied to this phone number.
    // For the hackathon, we pass the phone number as the account number to the Sandbox API.
    // This ensures the API call registers on the Nomba Developer Dashboard!
    
    const { NombaService } = require('../services/nomba.service');
    
    // Fire the real API call
    const result = await NombaService.transferFunds(
      amount || 10, 
      phone.replace(/\D/g, '').substring(0, 10), // Use raw digits as mock account
      `PayTrace Verification Reward for ${serial}`
    );

    res.json({ success: true, api_response: result });
  } catch (error) {
    console.error('[Claim Reward Error]', error);
    res.status(500).json({ error: 'Failed to execute Nomba reward transfer' });
  }
});

export default router;
