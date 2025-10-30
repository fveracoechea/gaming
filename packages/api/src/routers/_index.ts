import type { RouterClient } from '@orpc/server';

import { procedures } from '../procedure';
import { teamRouter } from './team';

export const appRouter = {
  healthCheck: procedures.public.handler(() => {
    return 'OK';
  }),
  team: teamRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
