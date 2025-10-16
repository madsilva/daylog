
# Backend Guidelines

## Tech Stack

- **Runtime**: Bun (use instead of Node.js)
- **Framework**: Express
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: BetterAuth
- **Bot**: node-telegram-bot-api

## Key Commands

- Use `bun run dev` to start development server with hot reload
- Use `bun run build` to build for production
- Use `bun test` to run tests
- Bun automatically loads .env files (no need for dotenv package)

## Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── schema.ts    # Drizzle schema definitions
│   │   └── index.ts     # Database connection
│   ├── routes/
│   │   ├── auth.ts      # BetterAuth routes
│   │   ├── entries.ts   # Entry CRUD operations
│   │   └── bot.ts       # Telegram bot webhook endpoints
│   ├── middleware/
│   │   └── botAuth.ts   # Bot API key authentication
│   ├── bot/
│   │   └── index.ts     # Telegram bot logic
│   └── server.ts        # Express app setup
├── drizzle.config.ts    # Drizzle configuration
└── .env.example         # Environment variables template
```

## Database

- Use Drizzle ORM with PostgreSQL (hosted on Supabase)
- Run migrations with `bun run db:migrate`
- Generate types with `bun run db:generate`
