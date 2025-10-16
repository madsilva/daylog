import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate requests from the Telegram bot
 * Checks for the BOT_API_KEY in the request header
 */
export function authenticateBotRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers['x-bot-api-key'];
  const expectedKey = process.env.BOT_API_KEY;

  if (!expectedKey) {
    console.error('BOT_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (apiKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}
