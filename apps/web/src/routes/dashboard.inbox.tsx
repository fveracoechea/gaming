import { Form, data } from 'react-router';

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
import { H1, Typography } from '@gaming/ui/components/typography';
import type { InboxData } from '@gaming/zod/inbox';
import { formatDistanceToNow } from 'date-fns';
import {
  BellIcon,
  CheckCheckIcon,
  MailIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';

import type { Route } from './+types/dashboard.inbox';

export async function loader({ context }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const [messages, unreadCount] = await Promise.all([
    rpc.inbox.findMyMessages(),
    rpc.inbox.getUnreadCount(),
  ]);
  return { messages, unreadCount };
}

export async function action({ context, request }: Route.ActionArgs) {
  const rpc = getORPCClient(context);
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'markAsRead') {
    const messageId = formData.get('messageId');
    if (typeof messageId === 'string') {
      await rpc.inbox.markAsRead({ messageId });
    }
  } else if (intent === 'markAllAsRead') {
    await rpc.inbox.markAllAsRead();
  } else if (intent === 'deleteMessage') {
    const messageId = formData.get('messageId');
    if (typeof messageId === 'string') {
      await rpc.inbox.deleteMessage({ messageId });
    }
  }

  return data({ success: true });
}

function getMessageIcon(type: InboxData['type']) {
  switch (type) {
    case 'TEAM_INVITE':
    case 'TEAM_INVITE_ACCEPTED':
    case 'TEAM_INVITE_REJECTED':
    case 'TEAM_INVITE_WITHDRAWN':
      return <MailIcon className="h-5 w-5" />;
    case 'TEAM_ROLE_UPDATE':
      return <ShieldCheckIcon className="h-5 w-5" />;
    case 'TEAM_REMOVED':
      return <UsersIcon className="h-5 w-5" />;
    case 'TOURNAMENT_INVITE':
    case 'TOURNAMENT_JOIN_REQUEST':
      return <TrophyIcon className="h-5 w-5" />;
    default:
      return <BellIcon className="h-5 w-5" />;
  }
}

function getMessageTitle(data: InboxData): string {
  switch (data.type) {
    case 'TEAM_INVITE':
      return `Team Invitation from ${data.team.name}`;
    case 'TEAM_INVITE_ACCEPTED':
      return `${data.invitedUser.name} accepted your team invitation`;
    case 'TEAM_INVITE_REJECTED':
      return `${data.invitedUser.name} declined your team invitation`;
    case 'TEAM_INVITE_WITHDRAWN':
      return `Team invitation withdrawn`;
    case 'TEAM_ROLE_UPDATE':
      return `Your role in ${data.team.name} was updated`;
    case 'TEAM_REMOVED':
      return `You were removed from ${data.team.name}`;
    case 'TOURNAMENT_INVITE':
      return `Tournament invitation from ${data.invitedByTeam.name}`;
    case 'TOURNAMENT_JOIN_REQUEST':
      return `${data.team.name} wants to join the tournament`;
    default:
      return 'Notification';
  }
}

function getMessageDescription(data: InboxData): string {
  switch (data.type) {
    case 'TEAM_INVITE':
      return `${data.invitedByUser.name} (${data.invitedByUser.role}) invited you to join ${data.team.name}`;
    case 'TEAM_INVITE_ACCEPTED':
      return `${data.invitedUser.name} is now part of your team as a ${data.invitedUser.role}`;
    case 'TEAM_INVITE_REJECTED':
      return `${data.invitedUser.name} has declined to join your team`;
    case 'TEAM_INVITE_WITHDRAWN':
      return `${data.withdrawnBy.name} has withdrawn the invitation to ${data.team.name}`;
    case 'TEAM_ROLE_UPDATE':
      return `Your new role is ${data.user.role}`;
    case 'TEAM_REMOVED':
      return `You are no longer a member of ${data.team.name}`;
    case 'TOURNAMENT_INVITE':
      return `${data.invitedByTeam.name} invited you to join ${data.tournament.name}`;
    case 'TOURNAMENT_JOIN_REQUEST':
      return `${data.team.name} has requested to join the tournament`;
    default:
      return 'You have a new notification';
  }
}

export default function InboxPage({ loaderData }: Route.ComponentProps) {
  const { messages, unreadCount } = loaderData;

  return (
    <div className="@container space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <H1 className="text-3xl font-bold">Inbox</H1>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          <Typography variant="muted">
            All your notifications and team updates in one place.
          </Typography>
        </div>
        {unreadCount > 0 && (
          <Form method="post">
            <input type="hidden" name="intent" value="markAllAsRead" />
            <Button type="submit" variant="outline" size="sm">
              <CheckCheckIcon className="h-4 w-4" />
              Mark all as read
            </Button>
          </Form>
        )}
      </div>

      {messages.length === 0 && (
        <Card className="flex flex-col justify-center items-center p-12 gap-3">
          <MailIcon className="h-24 w-24 stroke-muted" />
          <Typography variant="muted">Your inbox is empty.</Typography>
          <Typography variant="base">
            You'll receive notifications about team invites, tournaments, and more.
          </Typography>
        </Card>
      )}

      <div className="space-y-3">
        {messages.map(message => {
          const isUnread = !message.readAt;

          return (
            <Card
              key={message.id}
              className={isUnread ? 'border-l-4 border-l-primary bg-primary/5' : ''}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isUnread ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {getMessageIcon(message.data.type)}
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {getMessageTitle(message.data)}
                      </CardTitle>
                      <CardDescription>{getMessageDescription(message.data)}</CardDescription>
                      <Typography variant="muted" className="text-xs">
                        {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <Form method="post">
                        <input type="hidden" name="intent" value="markAsRead" />
                        <input type="hidden" name="messageId" value={message.id} />
                        <Button type="submit" variant="ghost" size="sm">
                          <CheckCheckIcon className="h-4 w-4" />
                          Mark read
                        </Button>
                      </Form>
                    )}
                    <Form method="post">
                      <input type="hidden" name="intent" value="deleteMessage" />
                      <input type="hidden" name="messageId" value={message.id} />
                      <Button type="submit" variant="ghost" size="sm">
                        Delete
                      </Button>
                    </Form>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
