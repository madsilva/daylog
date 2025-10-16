import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import botRoutes from './routes/bot';
import entriesRoutes from './routes/entries';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// BetterAuth routes - handles /api/auth/*
app.use('/api/auth', toNodeHandler(auth));

// API routes
app.use('/api/bot', botRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Start Telegram bot
import('./bot/index');
