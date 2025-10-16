import { Router } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const router = Router();

/**
 * POST /api/user/generate-telegram-token
 * Generates a temporary token for linking Telegram account
 */
router.post('/generate-telegram-token', async (req, res) => {
  try {
    // TODO: Get user ID from session once BetterAuth middleware is set up
    const userId = req.body.userId as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new token
    await db
      .update(users)
      .set({
        telegramAuthToken: token,
        telegramTokenExpiresAt: expiresAt,
      })
      .where(eq(users.id, userId));

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
router.get('/me', async (req, res) => {
  try {
    // TODO: Get user ID from session once BetterAuth middleware is set up
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        telegramId: users.telegramId,
        telegramUsername: users.telegramUsername,
        timezone: users.timezone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
