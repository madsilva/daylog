import type { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware to verify user is authenticated via BetterAuth session
 * Adds userId to req object
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = session.user.id;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
