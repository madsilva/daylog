# Daylog MVP - Testing Guide

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL (from Supabase)
# - BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
# - TELEGRAM_BOT_TOKEN (from @BotFather)
# - BOT_API_KEY (generate with: openssl rand -hex 32)

# Install dependencies
bun install

# Push database schema
bun run db:push

# Start backend server
bun run dev
```

Backend will run on http://localhost:3000

### 2. Frontend Setup

```bash
cd frontend

# Copy and configure environment variables
cp .env.example .env

# Edit .env with:
# - VITE_API_URL=http://localhost:3000
# - VITE_TELEGRAM_BOT_USERNAME=your_bot_username (without @)

# Install dependencies
bun install

# Start frontend dev server
bun run dev
```

Frontend will run on http://localhost:5173 (or next available port)

## Testing Flow

### 1. Sign Up
1. Navigate to http://localhost:5173
2. Click "Sign up"
3. Enter name, email, and password (min 8 characters)
4. Submit form
5. Should redirect to dashboard

### 2. Link Telegram
1. On dashboard, click "Link Telegram" button
2. Click "Open Telegram Bot" link
3. Should open Telegram with your bot
4. Send `/start` command with token
5. Bot should confirm account linked
6. Refresh dashboard - should show "Telegram linked as @username"

### 3. Create Entries via Telegram
1. Send any message to the Telegram bot
2. Bot should respond with "✅ Entry recorded!"
3. Refresh dashboard
4. Entry should appear in today's list

### 4. View Entries
1. Dashboard shows past 7 days in sidebar
2. Click on a day to view entries for that date
3. Entries show with timestamp

### 5. Edit Entry
1. Click "Edit" on an entry
2. Modify text
3. Click "Save"
4. Entry should update

### 6. Delete Entry
1. Click "Delete" on an entry
2. Confirm deletion
3. Entry should disappear

### 7. Sign Out
1. Click "Sign out" in nav
2. Should redirect to login

## API Endpoints to Test

### Authentication
- POST /api/auth/sign-up
- POST /api/auth/sign-in
- POST /api/auth/sign-out
- GET /api/auth/session

### User
- GET /api/user/me
- POST /api/user/generate-telegram-token

### Entries
- GET /api/entries?startDate=...&endDate=...
- PATCH /api/entries/:id
- DELETE /api/entries/:id

### Bot (requires BOT_API_KEY header)
- POST /api/bot/link-telegram
- GET /api/bot/user/:telegramId
- POST /api/bot/entries

## Common Issues

### Backend won't start
- Check DATABASE_URL is correct
- Make sure PostgreSQL is accessible
- Run `bun run db:push` to create tables

### Can't sign up/login
- Check BETTER_AUTH_SECRET is set
- Check backend console for errors
- Verify CORS is allowing frontend URL

### Telegram bot not responding
- Check TELEGRAM_BOT_TOKEN is correct
- Verify bot is running (check backend logs for "Telegram bot started...")
- Make sure BOT_API_KEY matches between bot and backend

### Entries not showing
- Check browser console for API errors
- Verify session is valid (check /api/user/me response)
- Check backend logs for authentication errors

### Can't link Telegram
- Token expires in 10 minutes - generate a new one
- Check BOT_API_KEY is set correctly
- Verify bot username in frontend .env matches actual bot
