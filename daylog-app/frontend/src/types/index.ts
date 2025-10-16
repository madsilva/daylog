export interface Entry {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
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
