import express from 'express';
import cors from 'cors';
import { auth } from './lib/auth';
import botRoutes from './routes/bot';
import entriesRoutes from './routes/entries';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// BetterAuth routes - handles /api/auth/*
app.all('/api/auth/*', (req, res) => auth.handler(req, res));

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
