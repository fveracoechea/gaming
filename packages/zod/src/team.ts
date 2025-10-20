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
