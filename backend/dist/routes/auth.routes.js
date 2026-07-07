"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// Simple mock OTP generation
router.post('/otp/request', async (req, res) => {
    const { phone } = req.body;
    if (!phone)
        return res.status(400).json({ error: 'Phone required' });
    console.log(`[SMS Mock] Sending OTP 123456 to ${phone}`);
    res.json({ message: 'OTP sent successfully' });
});
router.post('/otp/verify', async (req, res) => {
    const { phone, code } = req.body;
    if (code !== '123456') {
        return res.status(401).json({ error: 'Invalid OTP' });
    }
    let participant = await prisma.participant.findUnique({ where: { phone_number: phone } });
    if (!participant) {
        participant = await prisma.participant.create({
            data: { phone_number: phone }
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: participant.id, role: 'participant' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, participant });
});
exports.default = router;
