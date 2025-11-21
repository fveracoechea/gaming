import { type MiddlewareFunction, data, href, redirect } from 'react-router';

import { createORPCContext } from '@gaming/api/context';
import { appRouter } from '@gaming/api/routers';
import { createRouterClient } from '@orpc/server';
import { createBatcherMiddleware } from 'remix-utils/middleware/batcher';
import { createContextStorageMiddleware } from 'remix-utils/middleware/context-storage';
import { createLoggerMiddleware } from 'remix-utils/middleware/logger';
import { createSecureHeadersMiddleware } from 'remix-utils/middleware/secure-headers';
import { createSingletonMiddleware } from 'remix-utils/middleware/singleton';

/**
 * Let's you get a per request instance of a batcher object
 * that will dedupe and batch multiple calls to the same function.
 * */
export const [batcherMiddleware, getBatcher] = createBatcherMiddleware();

/**
 * Let's you log the request and response information to the console
 */
export const [loggerMiddleware] = createLoggerMiddleware();

/**
 * Let's you set secure HTTP headers on the response
 */
export const [secureHeadersMiddleware] = createSecureHeadersMiddleware();

/**
 * Let's you store and retrieve data that is scoped to the current request context.
 */
export const [contextStorageMiddleware, getContext, getRequest] =
  createContextStorageMiddleware();

/**
 * Singleton ORPC server middleware and RPC client.
 *
 * This client instance is shared across all requests, so only include context that's safe to reuse globally.
 * For per-request context, use middleware context or pass a function as the initial context.
 * */
export const [oprcServerMiddleware, getORPCClient] = createSingletonMiddleware({
  instantiator(request, context) {
    const batcher = getBatcher(context);
    return createRouterClient(appRouter, {
      context: batcher.call(['orpc-auth'], () => createORPCContext({ request })),
    });
  },
});

/**
 * Middleware that requires the user to be authenticated.
 * If the user is not authenticated, they will be redirected to the sign-in page.
 */
export const requireAuthMiddleware: MiddlewareFunction<Response> = async ({ context }) => {
  try {
    const rpc = getORPCClient(context);
    const whoami = await rpc.whoami();
    if (!whoami.user) throw data('Unauthorized', { status: 401 });
  } catch (error) {
    throw redirect(href('/sign-in'));
  }
};
