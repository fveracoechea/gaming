import { db } from '@gaming/db';
import * as authSchema from '@gaming/db/schema/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, username } from 'better-auth/plugins';

export const auth = betterAuth({
  plugins: [username(), admin()],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ''],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    },
  },
});
