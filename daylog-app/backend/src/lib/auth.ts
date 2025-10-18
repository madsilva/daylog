import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db';

const cookieAttributes = {
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  partitioned: process.env.NODE_ENV === 'production',
} as const;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [process.env.FRONTEND_URL || 'http://localhost:5173'],
  advanced: {
    cookies: {
      session_token: {
        attributes: cookieAttributes,
      },
      session_data: {
        attributes: cookieAttributes,
      },
      dont_remember: {
        attributes: cookieAttributes,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
