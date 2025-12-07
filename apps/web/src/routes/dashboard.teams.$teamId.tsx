import { getORPCClient } from '@/lib/middlewares.server';
import { DeleteTeamDialog } from '@/resources/team.delete.$teamId';
import { TeamEditForm } from '@/resources/team.edit.$teamId';
import { InvitePlayersToTeamDialog } from '@/resources/team.invite.$teamId';
import { WithdrawInviteButton } from '@/resources/team.withdraw-invite.$inviteId';
import { getTeamPlaceholderImage } from '@/utils/team';
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
import { TrashIcon } from 'lucide-react';

import type { Route } from './+types/dashboard.teams.$teamId';

export async function loader({ context, params }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const [team, invites] = await Promise.all([
    rpc.team.findById(params.teamId),
    rpc.team.listTeamInvites({ teamId: params.teamId }),
  ]);
  return { team, invites };
}

export default function TeamDetails({ loaderData }: Route.ComponentProps) {
  const { team, invites } = loaderData;
  const pendingInvites = invites.filter(inv => inv.status === 'PENDING');

  return (
    <div className="@container space-y-6">
      <header className="flex items-center gap-4">
        <img
          height={72}
          width={72}
          alt={team.name}
          className="h-18 w-18 rounded-md border bg-muted object-cover"
          src={team.logoUrl || getTeamPlaceholderImage(team.name)}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">{team?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {team?.description || 'No description provided.'}
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>Active members and pending invites for your team</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Active Members */}
          {team.members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between px-4 py-2 even:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-medium">
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

          {/* Pending Invites */}
          {pendingInvites.map(invite => (
            <div
              key={invite.id}
              className="flex items-center justify-between px-4 py-2 even:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed bg-muted/50 text-sm font-medium">
                  {getInitials(invite.invitedUser.name)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-none font-medium">{invite.invitedUser.name}</p>
                  <span className="text-xs text-muted-foreground">
                    Invited {formatDistanceToNow(invite.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{invite.role}</Badge>
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                >
                  PENDING
                </Badge>
                <WithdrawInviteButton
                  inviteId={invite.id}
                  playerName={invite.invitedUser.name}
                />
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <InvitePlayersToTeamDialog team={team} />

          <Button size="sm" variant="outline">
            <span>Find Tournaments</span>
          </Button>
          <Button size="sm">
            <span>Start a Tournament</span>
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
        <CardContent>
          <TeamEditForm team={team} />
        </CardContent>
      </Card>

      <Card className="border-dashed border-destructive bg-transparent px-0 py-4 flex-row">
        <CardHeader className="flex-1">
          <CardTitle className="text-xs font-semibold text-destructive uppercase">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Delete this team and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center">
          <DeleteTeamDialog team={team} />
        </CardContent>
      </Card>
    </div>
  );
}
