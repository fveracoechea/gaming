import * as t from "drizzle-orm/pg-core";
import { user } from "./auth";
import type {
  DotaLobbyState,
  TournamentEntryPaymentStatus,
  TournamentFormat,
  TournamentMatchStatus,
  TournamentParticipantStatus,
  TournamentPayoutStatus,
  TournamentStatus,
} from "@gaming/zod/tournaments";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: t
    .timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
};

/**
 * Shared primary key column (text UUID)
 */
const id = t
  .text()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

// Games supported by the platform (e.g. Dota2, others in future)
export const game = t.pgTable("game", {
  id, // e.g. "dota2" if manually set; defaults to UUID
  name: t.text().notNull(),
  slug: t.text().notNull().unique(),
  ...timestamps,
});

export const tournament = t.pgTable("tournament", {
  id,
  organizerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  gameId: t
    .text()
    .notNull()
    .references(() => game.id, { onDelete: "restrict" }),
  title: t.text().notNull(),
  description: t.text(),
  region: t.text(),
  format: t.text().$type<TournamentFormat>().notNull(),
  status: t.text().$type<TournamentStatus>().notNull().default("DRAFT"),
  entryFeeCents: t.integer().default(0).notNull(),
  prizePoolLogic: t.text(),
  registrationLimit: t.integer(),
  inviteOnly: t.boolean().default(false).notNull(),
  startsAt: t.timestamp(),
  endsAt: t.timestamp(),
  registrationOpensAt: t.timestamp(),
  registrationClosesAt: t.timestamp(),
  publishedAt: t.timestamp(),
  ...timestamps,
});

export const tournamentInvite = t.pgTable("tournament_invite", {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const tournamentParticipant = t.pgTable("tournament_participant", {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: t.text().$type<TournamentParticipantStatus>().notNull().default(
    "REGISTERED",
  ),
  placement: t.integer(),
  earningsCents: t.integer().default(0).notNull(),
  ...timestamps,
});

export const tournamentMatch = t.pgTable("tournament_match", {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  round: t.integer(),
  sequence: t.integer(),
  status: t.text().$type<TournamentMatchStatus>().notNull().default("PENDING"),
  winnerParticipantId: t.text().references(
    () => tournamentParticipant.id,
    { onDelete: "set null" },
  ),
  dotaMatchId: t.text(),
  openDotaMatchId: t.text(),
  replayUrl: t.text(),
  startedAt: t.timestamp(),
  completedAt: t.timestamp(),
  ...timestamps,
});

export const tournamentMatchParticipant = t.pgTable(
  "tournament_match_participant",
  {
    id,
    matchId: t
      .text()
      .notNull()
      .references(() => tournamentMatch.id, { onDelete: "cascade" }),
    participantId: t
      .text()
      .notNull()
      .references(() => tournamentParticipant.id, { onDelete: "cascade" }),
    seed: t.integer(),
    score: t.integer().default(0).notNull(),
    ...timestamps,
  },
);

export const dotaLobby = t.pgTable("dota_lobby", {
  id,
  matchId: t
    .text()
    .notNull()
    .references(() => tournamentMatch.id, { onDelete: "cascade" }),
  name: t.text(),
  password: t.text(),
  state: t.text().$type<DotaLobbyState>().notNull().default("CREATING"),
  ...timestamps,
});

export const tournamentEntryPayment = t.pgTable("tournament_entry_payment", {
  id,
  participantId: t
    .text()
    .notNull()
    .references(() => tournamentParticipant.id, { onDelete: "cascade" }),
  amountCents: t.integer().notNull(),
  stripePaymentIntentId: t.text(),
  status: t.text().$type<TournamentEntryPaymentStatus>().notNull().default(
    "PENDING",
  ),
  ...timestamps,
});

export const tournamentPayout = t.pgTable("tournament_payout", {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  participantId: t.text().references(() => tournamentParticipant.id, {
    onDelete: "set null",
  }),
  organizerId: t.text().references(() => user.id, { onDelete: "set null" }),
  type: t.text().notNull(),
  amountCents: t.integer().notNull(),
  status: t.text().$type<TournamentPayoutStatus>().notNull().default("PENDING"),
  ...timestamps,
});
