import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// In-memory store for OTPs (Demo purpose only)
const otpStore: Record<string, string> = {};

// Generate dynamic OTP
router.post('/otp/request', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phone] = code;

  console.log(`\n\n================================`);
  console.log(`[SMS Mock] OTP for ${phone} is: ${code}`);
  console.log(`================================\n\n`);

  res.json({ message: 'OTP sent successfully' });
});

router.post('/otp/verify', async (req, res) => {
  const { phone, code } = req.body;
  
  if (otpStore[phone] !== code) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  // Clear OTP after successful use
  delete otpStore[phone];

  let participant = await prisma.participant.findUnique({ where: { phone_number: phone } });
  if (!participant) {
    participant = await prisma.participant.create({
      data: { phone_number: phone }
    });
  }

  const token = jwt.sign({ id: participant.id, role: 'participant' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, participant });
});

// Demo 1-Click Login
router.post('/demo-login', async (req, res) => {
  const { role } = req.body; // 'manufacturer' | 'distributor'
  
  if (role === 'manufacturer') {
    // Find the seeded organization
    const org = await prisma.organization.findFirst();
    if (!org) return res.status(404).json({ error: 'No manufacturer found' });
    const token = jwt.sign({ id: org.id, role: 'manufacturer' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: org.id, role: 'manufacturer', name: org.name } });
  } 
  
  if (role === 'distributor') {
    // Find the seeded distributor
    const participant = await prisma.participant.findFirst({ where: { phone_number: '+2348000000000' }});
    if (!participant) return res.status(404).json({ error: 'No distributor found' });
    const token = jwt.sign({ id: participant.id, role: 'distributor' }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: participant.id, role: 'distributor', name: 'Distributor Demo' } });
  }

  res.status(400).json({ error: 'Invalid role' });
});

export default router;
