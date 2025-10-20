import { z } from 'zod';

// Tournament format types
export const TournamentFormatEnum = z.enum([
  'SINGLE_ELIMINATION',
  'DOUBLE_ELIMINATION',
  'ROUND_ROBIN',
  'SWISS',
  'LEAGUE',
]);
export type TournamentFormat = z.infer<typeof TournamentFormatEnum>;

export const TournamentTypeEnum = z.enum(['PUBLIC', 'INVITE_ONLY']);
export type TournamentType = z.infer<typeof TournamentTypeEnum>;

// High-level tournament lifecycle statuses
export const TournamentStatusEnum = z.enum([
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELED',
]);

export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;

// Individual participant statuses within a tournament
export const TournamentParticipantStatusEnum = z.enum([
  'REGISTERED', // registered but not yet active
  'CHECKED_IN', // confirmed ready to play
  'ACTIVE', // currently competing
  'ELIMINATED', // lost and out
  'WITHDRAWN', // voluntarily left
  'DISQUALIFIED', // removed for rule violation
  'WINNER', // final winner (optional terminal state)
]);
export type TournamentParticipantStatus = z.infer<typeof TournamentParticipantStatusEnum>;

// State of a Dota (or game) lobby orchestration
export const DotaLobbyStateEnum = z.enum([
  'CREATING', // initial provisioning
  'READY', // lobby created and waiting
  'STARTING', // starting match process
  'ACTIVE', // lobby in-use / match underway
  'COMPLETED', // match concluded
  'FAILED', // unrecoverable error
  'CANCELED', // canceled intentionally
]);

export type DotaLobbyState = z.infer<typeof DotaLobbyStateEnum>;
