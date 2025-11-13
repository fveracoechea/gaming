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

function getTeamInitials(name: string) {
  const splits = name.split(' ');
  if (splits.length === 1) return name.slice(0, 2).toUpperCase();
  return (splits.at(0)?.charAt(0) || '' + splits.at(1)?.charAt(0)).toUpperCase();
}

export const CreateTeamSchema = z
  .object({
    name: z
      .string({ error: 'Team name is required' })
      .trim()
      .min(3, 'Team name must be at least 3 characters')
      .max(30, 'Team name must be at most 30 characters')
      .regex(/^[A-Za-z0-9 _'\-]+$/, 'Team name contains invalid characters'),
    logoUrl: z.preprocess(
      v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z
        .url('Logo URL must be a valid URL (include https://)')
        .trim()
        .max(300, 'Logo URL must be 300 characters or less')
        .optional(),
    ),
    description: z.preprocess(
      v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z
        .string()
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be 500 characters or less')
        .optional(),
    ),
  })
  .transform(data => ({
    ...data,
    logoUrl: data.logoUrl ?? `https://placehold.co/64x64?text=${getTeamInitials(data.name)}`,
  }));
