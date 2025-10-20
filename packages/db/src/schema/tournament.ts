import type {
  TournamentFormat,
  TournamentParticipantStatus,
  TournamentStatus,
  TournamentType,
} from '@gaming/zod/tournaments';
import * as t from 'drizzle-orm/pg-core';

import { user } from './auth';
import { id, timestamps } from './common';
import { game } from './game';

export const tournament = t.pgTable('tournament', {
  id,
  organizerId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  gameId: t
    .text()
    .notNull()
    .references(() => game.id, { onDelete: 'restrict' }),
  title: t.varchar().notNull(),
  description: t.text(),
  region: t.varchar({ length: 50 }),
  format: t.varchar().$type<TournamentFormat>().notNull(),
  status: t.varchar().$type<TournamentStatus>().notNull().default('DRAFT'),
  type: t.varchar().$type<TournamentType>().notNull().default('PUBLIC'),
  entryFeeCents: t.integer().default(0).notNull(),
  prizePoolLogic: t.varchar({ length: 255 }),
  registrationLimit: t.integer(),
  startsAt: t.timestamp(),
  endsAt: t.timestamp(),
  registrationOpensAt: t.timestamp(),
  registrationClosesAt: t.timestamp(),
  publishedAt: t.timestamp(),
  ...timestamps,
});

export const tournamentInvite = t.pgTable('tournament_invite', {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: 'cascade' }),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ...timestamps,
});

export const tournamentParticipant = t.pgTable('tournament_participant', {
  id,
  tournamentId: t
    .text()
    .notNull()
    .references(() => tournament.id, { onDelete: 'cascade' }),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: t.varchar().$type<TournamentParticipantStatus>().notNull().default('REGISTERED'),
  placement: t.integer(),
  earningsCents: t.integer().default(0).notNull(),
  ...timestamps,
});
