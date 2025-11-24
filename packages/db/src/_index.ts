import { env } from '@gaming/zod';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './db-schema';

export * as schema from './db-schema';

export const db = drizzle({
  schema,
  casing: 'snake_case',
  connection: {
    ssl: env.DATABASE_SSL,
    connectionString: env.DATABASE_URL,
  },
});
