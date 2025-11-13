import type { TeamMemberRole, TeamTournamentParticipantStatus } from '@gaming/zod';
import { eq, relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

import { id, timestamps } from '../common';
import { user } from './auth';
import { match } from './match';
import { tournament } from './tournament';

/**
 * Teams created by users. A team can have many members (users)
 * and a user can belong to many teams via team_member.
 * Each team has exactly one captain designated via a single team_member row
 * (role = 'CAPTAIN'); captaincy can transfer by updating roles atomically.
 * Teams can register for tournaments and be placed into matches
 * using the tournament_team_participant and match_team_participant tables.
 */
export const team = t.pgTable('team', {
  id,
  name: t.varchar().notNull(),
  description: t.text(),
  logoUrl: t.text(),
  ...timestamps,
});

export const teamRelations = relations(team, ({ many }) => ({
  members: many(teamMember),
}));

/**
 * Many-to-many link between teams and users.
 * Role includes CAPTAIN; enforce only one CAPTAIN per team via index
 */
export const teamMember = t.pgTable(
  'team_member',
  {
    id,
    teamId: t
      .uuid()
      .notNull()
      .references(() => team.id, { onDelete: 'cascade' }),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: t.varchar().$type<TeamMemberRole>(),
    ...timestamps,
  },
  table => [
    t
      .uniqueIndex('team_one_captain_per_team_idx')
      .on(table.teamId)
      .where(eq(table.role, sql`'CAPTAIN'`)),
    t
      .uniqueIndex('team_one_coach_per_team_idx')
      .on(table.teamId)
      .where(eq(table.role, sql`'COACH'`)),
  ],
);

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));

/**
 * Teams registered in a tournament (parallel to tournament_participant for users)
 * Reuses TournamentParticipantStatus for consistency.
 */
export const tournamentTeamParticipant = t.pgTable('tournament_team_participant', {
  id,
  tournamentId: t
    .uuid()
    .notNull()
    .references(() => tournament.id, { onDelete: 'cascade' }),
  teamId: t
    .uuid()
    .notNull()
    .references(() => team.id, { onDelete: 'cascade' }),
  status: t.varchar().$type<TeamTournamentParticipantStatus>().notNull().default('REGISTERED'),
  placement: t.integer(),
  earningsCents: t.integer().default(0).notNull(),
  ...timestamps,
});

/**
 * Linking table between matches and team tournament participants.
 * Mirrors match_participant but for teams.
 */
export const matchTeamParticipant = t.pgTable('match_team_participant', {
  id,
  matchId: t
    .uuid()
    .notNull()
    .references(() => match.id, { onDelete: 'cascade' }),
  teamParticipantId: t
    .uuid()
    .notNull()
    .references(() => tournamentTeamParticipant.id, { onDelete: 'cascade' }),
  seed: t.integer(),
  score: t.integer().default(0).notNull(),
  ...timestamps,
});
