import { Router } from 'express';
import { db } from '../db';
import { user } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

/**
 * POST /api/user/generate-telegram-token
 * Generates a temporary token for linking Telegram account
 */
router.post('/generate-telegram-token', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new token
    await db
      .update(user)
      .set({
        telegramAuthToken: token,
        telegramTokenExpiresAt: expiresAt,
      })
      .where(eq(user.id, userId));

    res.json({ token, expiresAt });
  } catch (error) {
    console.error('Error generating Telegram token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/user/me
 * Get current user info
 */
router.get('/me', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    const [userData] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        telegramId: user.telegramId,
        telegramUsername: user.telegramUsername,
        timezone: user.timezone,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
