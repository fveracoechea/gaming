import { ORPCError, os } from '@orpc/server';

import type { Context } from './context';

const o = os.$context<Context>();

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.auth?.user) {
    throw new ORPCError('UNAUTHORIZED');
  }

  return next({
    context: {
      auth: context.auth,
    },
  });
});

export const procedures = {
  public: o,
  protected: o.use(requireAuth),
};
