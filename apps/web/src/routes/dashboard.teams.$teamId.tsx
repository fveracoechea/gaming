import { getORPCClient } from '@/lib/middlewares.server';
import { Badge } from '@gaming/ui/components/badge';
import { Button } from '@gaming/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';
import { getInitials } from '@gaming/ui/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { PenIcon, PlusIcon, TrashIcon } from 'lucide-react';

import type { Route } from './+types/dashboard.teams.$teamId';

export async function loader({ context, params }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const team = await rpc.team.findById(params.teamId);
  return { team };
}

export default function TeamDetails({ loaderData }: Route.ComponentProps) {
  const { team } = loaderData;
  return (
    <div className="@container space-y-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{team?.name}</h1>
        <p className="text-sm text-muted-foreground">
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
        <CardContent>
          {team.members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between px-4  py-2 even:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium">
                  {getInitials(member.user.name)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-none font-medium">{member.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDistanceToNow(member.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={member.role === 'CAPTAIN' ? 'secondary' : 'outline'}>
                  {member.role}
                </Badge>
                <Button variant="ghost" size="icon-sm" aria-label="Remove Member">
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <Button size="sm" variant="outline">
            <span>Find Tournaments</span>
          </Button>
          <Button size="sm">
            <PlusIcon />
            <span>Add Member</span>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Team</CardTitle>
          <CardDescription>
            Update your team&apos;s information, including name, logo, and description
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <Card className="border-dashed border-destructive/50 bg-transparent px-0 py-4">
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-destructive uppercase">
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
