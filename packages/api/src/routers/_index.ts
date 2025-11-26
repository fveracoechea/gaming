import { db } from '@gaming/db';
import type { RouterClient } from '@orpc/server';
import { sql } from 'drizzle-orm';

import { procedures as p } from '../procedure';
import * as player from './player';
import * as team from './team';

async function healthCheck() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('Database health check successful!');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

export const appRouter = {
  team,
  player,
  healthCheck: p.public.handler(() => healthCheck()),
  whoami: p.protected.handler(({ context }) => context.auth),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
