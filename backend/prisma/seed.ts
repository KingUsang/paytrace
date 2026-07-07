import { PrismaClient, Terms, Status, ItemScanResult } from '@prisma/client';
import { NombaService } from '../src/services/nomba.service';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Ensure a default Organization (Manufacturer)
  const manufacturer = await prisma.organization.create({
    data: {
      name: 'PayTrace Manufacturer Inc.',
      // @ts-ignore
      nomba_business_account_id: process.env.NOMBA_ACCOUNT_ID || 'demo-account-id',
    }
  });
  console.log(`✅ Created Manufacturer: ${manufacturer.name}`);

  // 2. Ensure a default Participant (Distributor)
  const distributorPhone = '+2348000000000';
  const distributor = await prisma.participant.upsert({
    where: { phone_number: distributorPhone },
    update: {},
    create: {
      phone_number: distributorPhone,
      password: 'demo' // For testing if needed
    }
  });
  console.log(`✅ Created/Found Distributor: ${distributorPhone}`);

  // 3. Create Batches
  const batchesData = [
    { name: 'Industrial Grade Silicon (Grade A)', qty: 1500, price: 25000 },
    { name: 'Machined Aluminum Casings', qty: 500, price: 45000 },
    { name: 'Consumer Electronics Base Assembly', qty: 2000, price: 15000 },
    { name: 'Agrochemicals (Premium Blend)', qty: 1000, price: 30000 }
  ];

  const batches = [];
  for (const b of batchesData) {
    let vaData = { virtualAccountId: null, accountNumber: null };
    try {
      const res = await NombaService.createVirtualAccount(`SEED-${b.name.substring(0, 10)}`, `PayTrace - Batch ${b.name}`);
      vaData.virtualAccountId = res.virtualAccountId as any;
      vaData.accountNumber = res.accountNumber as any;
    } catch (e) {
      console.log(`⚠️ Nomba API failed for seeded batch ${b.name}, falling back to mock VA.`);
      vaData.accountNumber = '8023941102' as any;
    }

    const batch = await prisma.batch.create({
      data: {
        organization_id: manufacturer.id,
        product_name: b.name,
        quantity: b.qty,
        unit_price: b.price,
        declared_terms: Terms.CASH,
        status: Status.PAYMENT_VERIFIED, // Pre-verified so it looks good on dashboard
        nomba_virtual_account_id: vaData.virtualAccountId,
        nomba_virtual_account_number: vaData.accountNumber
      }
    });
    batches.push(batch);
  }
  console.log(`✅ Created ${batches.length} Batches`);

  // 4. Create Allocations (Linking Batch to Distributor)
  const allocations = [];
  // Give first batch to distributor on CREDIT
  allocations.push(
    await prisma.allocation.create({
      data: {
        batch_id: batches[0].id,
        to_participant_id: distributor.id,
        quantity: 500,
        declared_terms: Terms.CREDIT,
        credit_term_days: 30,
        status: Status.PENDING, // This will show up in "Settle Balances"
      }
    })
  );

  // Give second batch to distributor on CASH
  allocations.push(
    await prisma.allocation.create({
      data: {
        batch_id: batches[1].id,
        to_participant_id: distributor.id,
        quantity: 200,
        declared_terms: Terms.CASH,
        status: Status.PENDING, // This will show up in "Incoming Claims"
      }
    })
  );

  // Give third batch to distributor (already verified)
  allocations.push(
    await prisma.allocation.create({
      data: {
        batch_id: batches[2].id,
        to_participant_id: distributor.id,
        quantity: 800,
        declared_terms: Terms.CASH,
        status: Status.PAYMENT_VERIFIED, // Will show in Inventory
      }
    })
  );
  console.log(`✅ Created ${allocations.length} Allocations`);

  // 5. Create ItemScans
  const scanData = [
    { code: 'PT-992-A4X', loc: 'Lagos Port Terminal', res: ItemScanResult.GENUINE, reason: null },
    { code: 'PT-992-B7Y', loc: 'Abuja Dist. Center', res: ItemScanResult.FLAGGED, reason: 'Duplicate Claim Attempt' },
    { code: 'PT-993-C1Z', loc: 'Kano Warehouse', res: ItemScanResult.GENUINE, reason: null },
    { code: 'PT-988-X2A', loc: 'Ibadan Retail Store', res: ItemScanResult.FLAGGED, reason: 'Chain of Custody Mismatch' },
    { code: 'PT-995-E5W', loc: 'Port Harcourt Hub', res: ItemScanResult.GENUINE, reason: null },
  ];

  for (const s of scanData) {
    await prisma.itemScan.create({
      data: {
        batch_id: batches[0].id,
        item_code: s.code,
        location: s.loc,
        result: s.res,
        flag_reason: s.reason,
      }
    });
  }
  console.log(`✅ Created ${scanData.length} ItemScans`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    // @ts-ignore
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
