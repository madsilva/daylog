import { Router } from 'express';
import { db } from '../db';
import { user, entries } from '../db/schema';
import { eq } from 'drizzle-orm';
import { authenticateBotRequests } from '../middleware/botAuth';

const router = Router();

// Apply bot authentication middleware to all routes
router.use(authenticateBotRequests);

/**
 * POST /api/bot/link-telegram
 * Links a Telegram account to a user account
 */
router.post('/link-telegram', async (req, res) => {
  try {
    const { token, telegramId, telegramUsername } = req.body;

    if (!token || !telegramId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find user with matching auth token that hasn't expired
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.telegramAuthToken, token))
      .limit(1);

    if (!foundUser) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    // Check if token has expired
    if (foundUser.telegramTokenExpiresAt && foundUser.telegramTokenExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Token has expired' });
    }

    // Update user with Telegram info and clear token
    await db
      .update(user)
      .set({
        telegramId,
        telegramUsername: telegramUsername || null,
        telegramAuthToken: null,
        telegramTokenExpiresAt: null,
      })
      .where(eq(user.id, foundUser.id));

    res.json({ success: true, userId: foundUser.id });
  } catch (error) {
    console.error('Error linking Telegram account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/bot/user/:telegramId
 * Gets user ID by Telegram ID
 */
router.get('/user/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;

    const [foundUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.telegramId, telegramId))
      .limit(1);

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ userId: foundUser.id });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/bot/entries
 * Creates a new entry for a user
 */
router.post('/entries', async (req, res) => {
  try {
    const { userId, content, timestamp } = req.body;

    if (!userId || !content || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [entry] = await db
      .insert(entries)
      .values({
        userId,
        content,
        timestamp: new Date(timestamp), // Use the timestamp from Telegram message
      })
      .returning();

    res.json({ success: true, entry });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
