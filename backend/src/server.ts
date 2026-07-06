import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import batchRoutes from './routes/batch.routes';
import webhookRoutes from './routes/webhook.routes';
import settlementRoutes from './routes/settlement.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/settlements', settlementRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PayTrace API' });
});

app.listen(PORT, () => {
  console.log(`[Server] running on http://localhost:${PORT}`);
});
