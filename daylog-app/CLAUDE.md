
# Daylog Project Guidelines

## Tech Stack

### Backend
- **Runtime**: Bun (instead of Node.js)
- **Framework**: Express
- **Database ORM**: Drizzle with PostgreSQL
- **Authentication**: BetterAuth
- **Bot**: node-telegram-bot-api

### Frontend
- **Framework**: React with Vite
- **Styling**: TailwindCSS
- **Build tool**: Vite

## Bun Commands

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env files

## Database

- Use Drizzle ORM with PostgreSQL
- Connection via `pg` package
- Database hosted on Supabase

## Testing

Use `bun test` to run tests.

```ts
import { test, expect } from "bun:test";

test("example test", () => {
  expect(1).toBe(1);
});
```
