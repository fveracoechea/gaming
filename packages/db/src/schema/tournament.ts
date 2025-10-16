import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import type { TournamentFormat, TournamentStatus } from "@gaming/zod/tournaments";

// Use text columns with $type to infer union types from Zod definitions (no DB enums)

// Games supported by the platform (e.g. Dota2, others in future)
export const game = pgTable("game", {
  id: text("id").primaryKey(), // e.g. "dota2"
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Core tournament entity
export const tournament = pgTable("tournament", {
  id: text("id").primaryKey(),
  organizerId: text("organizer_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  gameId: text("game_id")
    .notNull()
    .references(() => game.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  description: text("description"),
  region: text("region"),
  format: text("format").$type<TournamentFormat>().notNull(),
  status: text("status").$type<TournamentStatus>().notNull().default("DRAFT"),
  entryFeeCents: integer("entry_fee_cents").default(0).notNull(), // 0 = free
  prizePoolLogic: text("prize_pool_logic"), // description / formula reference
  registrationLimit: integer("registration_limit"),
  inviteOnly: boolean("invite_only").default(false).notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  registrationOpensAt: timestamp("registration_opens_at"),
  registrationClosesAt: timestamp("registration_closes_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  publishedAt: timestamp("published_at"),
});

// Optional invite list for invite-only tournaments
export const tournamentInvite = pgTable("tournament_invite", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Participant registration
export const tournamentParticipant = pgTable("tournament_participant", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("registered"), // domain-specific participant status (lowercase acceptable)
  placement: integer("placement"), // final placement (1 = winner)
  earningsCents: integer("earnings_cents").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Matches within a tournament bracket
export const tournamentMatch = pgTable("tournament_match", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  round: integer("round"), // depends on format
  sequence: integer("sequence"), // ordering inside a round
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, canceled
  winnerParticipantId: text("winner_participant_id").references(
    () => tournamentParticipant.id,
    { onDelete: "set null" },
  ),
  // Dota 2 integration fields
  dotaMatchId: text("dota_match_id"), // internal GC / lobby match id
  openDotaMatchId: text("open_dota_match_id"), // external API reference
  replayUrl: text("replay_url"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Participants per match (supports more than 2 for round-robin / league)
export const tournamentMatchParticipant = pgTable("tournament_match_participant", {
  id: text("id").primaryKey(),
  matchId: text("match_id")
    .notNull()
    .references(() => tournamentMatch.id, { onDelete: "cascade" }),
  participantId: text("participant_id")
    .notNull()
    .references(() => tournamentParticipant.id, { onDelete: "cascade" }),
  seed: integer("seed"), // seeding position in bracket
  score: integer("score").default(0).notNull(), // game-specific score
});

// Dota 2 lobby metadata (created via Go microservice)
export const dotaLobby = pgTable("dota_lobby", {
  id: text("id").primaryKey(), // lobby identifier (custom uuid)
  matchId: text("match_id")
    .notNull()
    .references(() => tournamentMatch.id, { onDelete: "cascade" }),
  name: text("name"),
  password: text("password"),
  state: text("state").notNull().default("creating"), // creating, ready, started, ended, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Entry fee payment records (escrow model). Payouts tracked separately.
export const tournamentEntryPayment = pgTable("tournament_entry_payment", {
  id: text("id").primaryKey(),
  participantId: text("participant_id")
    .notNull()
    .references(() => tournamentParticipant.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: text("status").notNull().default("pending"), // pending, succeeded, failed, refunded
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Payout distribution after tournament completion
export const tournamentPayout = pgTable("tournament_payout", {
  id: text("id").primaryKey(),
  tournamentId: text("tournament_id")
    .notNull()
    .references(() => tournament.id, { onDelete: "cascade" }),
  participantId: text("participant_id").references(() => tournamentParticipant.id, {
    onDelete: "set null",
  }),
  organizerId: text("organizer_id").references(() => user.id, { onDelete: "set null" }),
  type: text("type").notNull(), // winner, organizer, platform, bonus
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("pending"), // pending, queued, paid, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
