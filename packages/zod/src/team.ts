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

function getTeamInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]?.[0]?.toUpperCase() || '?';
  return parts[0]?.[0]?.toUpperCase() || '' + parts?.[1]?.[0]?.toUpperCase() || '';
}

export const CreateOrUpdateTeamSchema = z
  .object({
    name: z
      .string({ error: 'Team name is required' })
      .trim()
      .min(3, 'Team name must be at least 3 characters')
      .max(30, 'Team name must be at most 30 characters')
      .regex(/^[A-Za-z0-9 _'\-]+$/, 'Team name contains invalid characters'),
    logoUrl: z.string().optional().or(z.url('Logo URL must be a valid URL')),
    description: z
      .string()
      .trim()
      .max(450, 'Description must be 450 characters or less')
      .optional(),
  })
  .transform(data => ({
    ...data,
    logoUrl: data.logoUrl ?? `https://placehold.co/64x64?text=${getTeamInitials(data.name)}`,
  }));
