import { getORPCClient } from '@/lib/middlewares.server';
import { env } from '@gaming/zod';

import type { Route } from './+types/healthcheck';

export async function loader({ context }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  return {
    dbOK: await rpc.healthCheck(),
    stage: env.STAGE,
    appURL: env.VITE_APP_URL,
    dbSSL: env.DATABASE_SSL,
  };
}

export default function HealthcheckPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Healthcheck</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
