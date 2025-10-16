w# Daylog Backend

Backend API for Daylog - a daily activity journaling app with Telegram bot integration.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: BetterAuth
- **Bot**: Telegram Bot API

## Setup

1. **Install dependencies**:
   ```bash
   bun install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (from Supabase)
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `TELEGRAM_BOT_TOKEN`: Get from [@BotFather](https://t.me/botfather) on Telegram
   - `BOT_API_KEY`: Generate with `openssl rand -hex 32`

3. **Set up the database**:
   ```bash
   # Generate migrations
   bun run db:generate

   # Push schema to database
   bun run db:push
   ```

4. **Run the development server**:
   ```bash
   bun run dev
   ```

   The server will start on `http://localhost:3000`

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:migrate` - Run database migrations
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio (database GUI)

## API Endpoints

### Authentication (BetterAuth)
- `POST /api/auth/sign-up` - Create new account
- `POST /api/auth/sign-in` - Sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

### User
- `POST /api/user/generate-telegram-token` - Generate token for linking Telegram
- `GET /api/user/me` - Get current user info

### Entries
- `GET /api/entries` - Get user's entries (supports date filtering)
- `PATCH /api/entries/:id` - Update an entry
- `DELETE /api/entries/:id` - Delete an entry

### Bot (Protected with BOT_API_KEY)
- `POST /api/bot/link-telegram` - Link Telegram account to user
- `GET /api/bot/user/:telegramId` - Get user ID by Telegram ID
- `POST /api/bot/entries` - Create entry from bot

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── schema.ts         # Database schema
│   │   └── index.ts          # Database connection
│   ├── lib/
│   │   └── auth.ts           # BetterAuth configuration
│   ├── routes/
│   │   ├── bot.ts            # Bot-specific endpoints
│   │   ├── entries.ts        # Entry CRUD operations
│   │   └── user.ts           # User endpoints
│   ├── middleware/
│   │   └── botAuth.ts        # Bot authentication middleware
│   ├── bot/
│   │   └── index.ts          # Telegram bot logic
│   └── server.ts             # Express app setup
├── drizzle.config.ts         # Drizzle configuration
└── .env.example              # Environment variables template
```
