import { procedures } from '@/procedure';
import type { RouterClient } from '@orpc/server';

import { todoRouter } from './todo';

export const appRouter = {
  healthCheck: procedures.public.handler(() => {
    return 'OK';
  }),
  privateData: procedures.protected.handler(({ context }) => {
    return {
      message: 'This is private',
      user: context.session?.user,
    };
  }),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
