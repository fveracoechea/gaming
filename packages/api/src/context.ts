import { auth } from '@gaming/auth/server';

export type CreateContextOptions = {
  request: Request;
};

export async function createORPCContext({ request }: CreateContextOptions) {
  const session = await auth.api.getSession({ headers: request.headers });
  return { auth: session };
}

export type Context = Awaited<ReturnType<typeof createORPCContext>>;
