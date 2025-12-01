import { z } from 'zod';

// Team membership roles including CAPTAIN designation
export const TeamMemberRoleEnum = z.enum(['CAPTAIN', 'MEMBER', 'COACH']);

export type TeamMemberRole = z.infer<typeof TeamMemberRoleEnum>;

// Team participant status in a tournament (mirror TournamentParticipantStatus)
export const TeamTournamentParticipantStatusEnum = z.enum([
  'REGISTERED',
  'CHECKED_IN',
  'ACTIVE',
  'ELIMINATED',
  'WITHDRAWN',
  'DISQUALIFIED',
  'WINNER',
]);

export type TeamTournamentParticipantStatus = z.infer<
  typeof TeamTournamentParticipantStatusEnum
>;

export const CreateOrUpdateTeamSchema = z.object({
  name: z
    .string({ error: 'Team name is required' })
    .trim()
    .min(3, 'Team name must be at least 3 characters')
    .max(30, 'Team name must be at most 30 characters')
    .regex(/^[A-Za-z0-9 _'\-]+$/, 'Team name contains invalid characters'),
  logoUrl: z.string().optional().or(z.url('Logo URL must be a valid URL').trim()),
  description: z
    .string()
    .trim()
    .max(450, 'Description must be 450 characters or less')
    .optional(),
});

export const DeleteTeamSchema = z.object({
  teamId: z.uuid(),
  comfirm: z.literal('I confirm that I want to delete this team', {
    error: '',
  }),
});

export const InvitePlayersToTeamSchema = z.object({
  teamId: z.uuid(),
  players: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        role: TeamMemberRoleEnum.extract(['COACH', 'MEMBER']),
      }),
    )
    .min(1, 'At least one player must be selected')
    .max(5, 'You can invite up to 5 players at a time'),
});
