import z from 'zod';

import { TeamMemberRoleEnum } from './team';

const BaseDataSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  image: z.string().optional().nullable().or(z.url()),
});

// Inbox message types enum
export const InboxMessageTypeEnum = z.enum([
  'TEAM_INVITE',
  'TEAM_INVITE_ACCEPTED',
  'TEAM_INVITE_REJECTED',
  'TEAM_INVITE_WITHDRAWN',
  'TEAM_ROLE_UPDATE',
  'TEAM_REMOVED',
  'TOURNAMENT_RESULT',
  'TOURNAMENT_INVITE',
  'TOURNAMENT_JOIN_REQUEST',
  'MATCH_RESULT',
  'PAYMENT_SUCCESS',
  'PAYOUT_RECEIVED',
  'SYSTEM_NOTIFICATION',
]);

export type InboxMessageType = z.infer<typeof InboxMessageTypeEnum>;

const TeamInviteInboxSchema = z.object({
  type: z.literal('TEAM_INVITE'),
  team: BaseDataSchema,
  invitedByUser: BaseDataSchema.extend({
    role: TeamMemberRoleEnum.extract(['COACH', 'PLAYER']),
  }),
});

const TeamInviteAcceptedInboxSchema = z.object({
  type: z.literal('TEAM_INVITE_ACCEPTED'),
  team: BaseDataSchema,
  invitedUser: BaseDataSchema.extend({
    role: TeamMemberRoleEnum.extract(['COACH', 'PLAYER']),
  }),
});

const TeamInviteRejectedInboxSchema = z.object({
  type: z.literal('TEAM_INVITE_REJECTED'),
  team: BaseDataSchema,
  invitedUser: BaseDataSchema.extend({
    role: TeamMemberRoleEnum.extract(['COACH', 'PLAYER']),
  }),
});

const TeamInviteWithdrawnInboxSchema = z.object({
  type: z.literal('TEAM_INVITE_WITHDRAWN'),
  team: BaseDataSchema,
  withdrawnBy: BaseDataSchema,
});

const TeamRoleUpdateInboxSchema = z.object({
  type: z.literal('TEAM_ROLE_UPDATE'),
  team: BaseDataSchema,
  user: BaseDataSchema.extend({
    role: TeamMemberRoleEnum,
  }),
});

const TeamRemovedInboxSchema = z.object({
  type: z.literal('TEAM_REMOVED'),
  team: BaseDataSchema,
  user: BaseDataSchema,
});

const TournamentJoinRequestInboxSchema = z.object({
  type: z.literal('TOURNAMENT_JOIN_REQUEST'),
  team: BaseDataSchema,
});

const TournamentInviteInboxSchema = z.object({
  type: z.literal('TOURNAMENT_INVITE'),
  invitedByTeam: BaseDataSchema,
  tournament: BaseDataSchema,
});

// Union type for all possible data shapes
export const InboxDataSchema = z.discriminatedUnion('type', [
  TeamInviteInboxSchema,
  TeamInviteAcceptedInboxSchema,
  TeamInviteRejectedInboxSchema,
  TeamInviteWithdrawnInboxSchema,
  TeamRoleUpdateInboxSchema,
  TeamRemovedInboxSchema,
  TournamentJoinRequestInboxSchema,
  TournamentInviteInboxSchema,
]);

export type InboxData = z.infer<typeof InboxDataSchema>;
