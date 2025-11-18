import { Link, href } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { Badge } from '@gaming/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';
import { getInitials } from '@gaming/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';

import type { Route } from './+types/dashboard.my-teams';

export async function loader({ context }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const teams = await rpc.team.findMyTeams();
  return { teams };
}

export default function MyTeamPage({ loaderData }: Route.ComponentProps) {
  const { teams } = loaderData;

  return (
    <div className="@container space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your squad, members, and tournament activity.
        </p>
      </div>

      <Card className="border-dashed border-muted-foreground/50 bg-transparent px-0 py-4">
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-accent uppercase">
            Multiple teams coming soon
          </CardTitle>
          <CardDescription className="text-xs">
            Soon you will be able to belong to up to 5 teams with the Pro plan.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 @6xl:grid-cols-2">
        {teams.map(team => {
          return (
            <Link to={href('/dashboard/teams/:teamId', { teamId: team.id })}>
              <Card className="group transition-colors hover:border-primary">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-4">
                    <img
                      alt={team.name}
                      className="h-16 w-16 rounded-md border bg-muted object-cover"
                      src={
                        team.logoUrl ||
                        `https://placehold.co/64x64?text=${team.name.charAt(0).toUpperCase()}`
                      }
                    />
                    <div className="space-y-1">
                      <CardTitle className="transition-colors group-hover:text-primary">
                        {team.name}
                      </CardTitle>
                      <CardDescription className="max-w-prose text-sm">
                        {team.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {team.members.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between px-4 py-2 even:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium">
                          {getInitials(member.user.name)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm leading-none font-medium">
                            {member.user.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Joined {formatDistanceToNow(member.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={member.role === 'CAPTAIN' ? 'secondary' : 'outline'}>
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
