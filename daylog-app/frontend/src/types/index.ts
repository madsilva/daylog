export interface Entry {
  id: string;
  userId: string;
  content: string;
  timestamp: string; // When user sent the message (from Telegram)
  createdOnDBAt: string; // When entry was created in DB
}

export interface User {
  id: string;
  name: string;
  email: string;
  telegramId?: string | null;
  telegramUsername?: string | null;
  timezone: string;
  createdAt: string;
}

export interface TelegramToken {
  token: string;
  expiresAt: string;
}
