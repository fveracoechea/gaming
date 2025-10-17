import { z } from "zod";

// Tournament format types
export const TournamentFormatEnum = z.enum([
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  "ROUND_ROBIN",
  "SWISS",
  "LEAGUE",
]);
export type TournamentFormat = z.infer<typeof TournamentFormatEnum>;

// High-level tournament lifecycle statuses
export const TournamentStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "REGISTRATION_OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
]);

export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;

// Individual participant statuses within a tournament
export const TournamentParticipantStatusEnum = z.enum([
  "REGISTERED", // registered but not yet active
  "CHECKED_IN", // confirmed ready to play
  "ACTIVE", // currently competing
  "ELIMINATED", // lost and out
  "WITHDRAWN", // voluntarily left
  "DISQUALIFIED", // removed for rule violation
  "WINNER", // final winner (optional terminal state)
]);
export type TournamentParticipantStatus = z.infer<
  typeof TournamentParticipantStatusEnum
>;

// Match status values within a tournament bracket/round
export const TournamentMatchStatusEnum = z.enum([
  "PENDING", // created but not started
  "READY", // all participants ready / lobby prepared
  "IN_PROGRESS", // match ongoing
  "COMPLETED", // finished with a winner
  "CANCELED", // intentionally canceled before completion
  "VOID", // invalidated / discarded result
]);
export type TournamentMatchStatus = z.infer<typeof TournamentMatchStatusEnum>;

// State of a Dota (or game) lobby orchestration
export const DotaLobbyStateEnum = z.enum([
  "CREATING", // initial provisioning
  "READY", // lobby created and waiting
  "STARTING", // starting match process
  "ACTIVE", // lobby in-use / match underway
  "COMPLETED", // match concluded
  "FAILED", // unrecoverable error
  "CANCELED", // canceled intentionally
]);

export type DotaLobbyState = z.infer<typeof DotaLobbyStateEnum>;

// Entry payment status values
export const TournamentEntryPaymentStatusEnum = z.enum([
  "PENDING", // intent created, awaiting confirmation
  "PROCESSING", // payment processor working
  "SUCCEEDED", // funds captured successfully
  "FAILED", // failed without capture
  "CANCELED", // manually canceled before success
  "REFUNDED", // refunded post success
]);

export type TournamentEntryPaymentStatus = z.infer<
  typeof TournamentEntryPaymentStatusEnum
>;

// Payout status for distributing winnings
export const TournamentPayoutStatusEnum = z.enum([
  "PENDING", // scheduled to be processed
  "PROCESSING", // in progress with provider
  "COMPLETED", // funds delivered
  "FAILED", // failed attempt
  "CANCELED", // canceled before completion
]);

export type TournamentPayoutStatus = z.infer<
  typeof TournamentPayoutStatusEnum
>;
