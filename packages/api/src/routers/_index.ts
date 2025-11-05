import type { RouterClient } from '@orpc/server';

import { procedures as p } from '../procedure';
import * as team from './team';

export const appRouter = {
  team,
  healthCheck: p.public.handler(() => 'OK'),
  whoami: p.protected.handler(({ context }) => context.auth),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
