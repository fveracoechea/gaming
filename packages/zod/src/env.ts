import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    DATABSE_SSL: z.stringbool().default(false),
    CORS_ORIGINS: z.url().default('http://localhost:5173'),
    BETTER_AUTH_SECRET: z.string().min(28),
  },

  client: {
    VITE_BACKEND_URL: z.url().default('http://localhost:3000'),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: typeof process !== 'undefined' ? process.env : import.meta.env,
  emptyStringAsUndefined: true,
  clientPrefix: 'VITE_',
});
