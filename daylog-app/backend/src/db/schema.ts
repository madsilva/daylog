import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  telegramId: varchar('telegram_id', { length: 255 }),
  telegramUsername: varchar('telegram_username', { length: 255 }),
  telegramAuthToken: text('telegram_auth_token'),
  telegramTokenExpiresAt: timestamp('telegram_token_expires_at'),
  timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const entries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
