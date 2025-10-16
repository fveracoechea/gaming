import { z } from "zod";

export const TournamentFormatEnum = z.enum([
  "SINGLE_ELIMINATION",
  "DOUBLE_ELIMINATION",
  "ROUND_ROBIN",
  "SWISS",
  "LEAGUE",
]);

export type TournamentFormat = z.infer<typeof TournamentFormatEnum>;

export const TournamentStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "REGISTRATION_OPEN",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
]);

export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;
