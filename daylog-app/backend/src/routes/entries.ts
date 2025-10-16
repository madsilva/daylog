import { Router } from 'express';
import { db } from '../db';
import { entries } from '../db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuth);

/**
 * GET /api/entries
 * Get entries for the authenticated user
 * Query params: startDate, endDate (optional)
 */
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { startDate, endDate } = req.query;

    let query = db
      .select()
      .from(entries)
      .where(eq(entries.userId, userId))
      .orderBy(desc(entries.timestamp));

    // Filter by date range if provided
    if (startDate && endDate) {
      query = db
        .select()
        .from(entries)
        .where(
          and(
            eq(entries.userId, userId),
            gte(entries.timestamp, new Date(startDate as string)),
            lte(entries.timestamp, new Date(endDate as string))
          )
        )
        .orderBy(desc(entries.timestamp));
    }

    const userEntries = await query;

    res.json({ entries: userEntries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PATCH /api/entries/:id
 * Update an entry
 */
router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Verify the entry belongs to the user
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)))
      .limit(1);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Update the entry
    const [updated] = await db
      .update(entries)
      .set({ content })
      .where(eq(entries.id, id))
      .returning();

    res.json({ entry: updated });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/entries/:id
 * Delete an entry
 */
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    // Verify the entry belongs to the user
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, id), eq(entries.userId, userId)))
      .limit(1);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    // Delete the entry
    await db.delete(entries).where(eq(entries.id, id));

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
