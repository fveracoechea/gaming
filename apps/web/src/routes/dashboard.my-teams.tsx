import { Link, href } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { Badge } from '@gaming/ui/components/badge';
import { Button } from '@gaming/ui/components/button';
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
    <div className="space-y-6 p-6 @container">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your squad, members, and tournament activity.
        </p>
      </div>

      <Card className="border-dashed bg-transparent border-muted-foreground/50 py-4 px-0">
        <CardHeader>
          <CardTitle className="text-xs uppercase font-semibold text-accent">
            Multiple teams coming soon
          </CardTitle>
          <CardDescription className="text-xs">
            Soon you will be able to belong to up to 5 teams with the Pro plan.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 grid-cols-1 @6xl:grid-cols-2">
        {teams.map(team => {
          return (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start gap-4">
                  <img
                    alt={team.name}
                    className="h-16 w-16 rounded-md border bg-muted object-cover"
                    src={
                      team.logoUrl ||
                      `https://placehold.co/64x64?text=${team.name.charAt(0).toUpperCase()}`
                    }
                  />
                  <div className="space-y-1">
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription className="text-sm max-w-prose">
                      {team.description}
                    </CardDescription>
                  </div>
                </div>
                <Button asChild>
                  <Link to={href('/dashboard/teams/:teamId', { teamId: team.id })}>
                    Manage Team
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base">Roster and Roles</p>

                {team.members.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between even:bg-muted/50  py-2 px-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium border">
                        {getInitials(member.user.name)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{member.user.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            Joined {formatDistanceToNow(member.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={member.role === 'CAPTAIN' ? 'secondary' : 'outline'}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
