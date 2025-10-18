import * as t from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { tournament, tournamentParticipant } from "./tournament";
import type { MatchStatus } from "@gaming/zod/tournaments";

/**
 * Matches within a tournament bracket/round
 * this links to participants via match_participant
 * and records match results, status, etc.
 */
export const match = t.pgTable("match", {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  round: t.integer(),
  sequence: t.integer(),
  status: t.varchar().$type<MatchStatus>().notNull().default("PENDING"),
  winnerParticipantId: t.text().references(
    () => tournamentParticipant.id,
    { onDelete: "set null" },
  ),
  dotaMatchId: t.varchar({ length: 50 }),
  openDotaMatchId: t.varchar({ length: 50 }),
  replayUrl: t.varchar({ length: 2048 }),
  startedAt: t.timestamp(),
  completedAt: t.timestamp(),
  ...timestamps,
});

/**
 * Linking table between matches and participants
 * records which participants are in which matches
 * also records seed and score for each participant in the match
 * used to determine winners, etc.
 */
export const matchParticipant = t.pgTable(
  "match_participant",
  {
    id,
    matchId: t
      .text()
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    participantId: t
      .text()
      .notNull()
      .references(() => tournamentParticipant.id, { onDelete: "cascade" }),
    seed: t.integer(),
    score: t.integer().default(0).notNull(),
    ...timestamps,
  },
);
