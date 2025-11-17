import { getORPCClient } from '@/lib/middlewares.server';
import { Card, CardDescription, CardHeader, CardTitle } from '@gaming/ui/components/card';

import type { Route } from './+types/dashboard.teams.$teamId';

export async function loader({ context, params }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const team = await rpc.team.findById(params.teamId);
  return { team };
}

export default function TeamDetails({ loaderData }: Route.ComponentProps) {
  const { team } = loaderData;

  return (
    <div className="space-y-6 p-6 @container">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{team?.name}</h1>
        <p className="text-muted-foreground text-sm">
          {team?.description || 'No description provided.'}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>
            List of players, coaches, and staff associated with your team
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-dashed bg-transparent border-muted-foreground/50 py-4 px-0">
        <CardHeader>
          <CardTitle className="text-xs uppercase font-semibold text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Delete this team and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
