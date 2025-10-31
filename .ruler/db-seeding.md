# Database Schema & Seeding Guide

This document explains how the database schema (Drizzle + Postgres) and the modular seeding
system work in this project.

## Overview

The database layer lives in `packages/db/src/schema/` and is defined using Drizzle ORM's
Postgres core (`drizzle-orm/pg-core`). Seeding utilities reside in `packages/db/seed/` and
populate development/test data with realistic randomized values using `@faker-js/faker`.

Key goals:

- Provide strongly typed schema & enums shared across application code.
- Enable fast, repeatable population of relational test data.
- Preserve foreign key integrity and realistic cross-entity relationships.

## Schema Structure

Each domain table is defined in its own file under `schema/` and re-exported via
`db-schema.ts`:

- `auth.ts`: Users and auth-related entities.
- `game.ts`: Supported games.
- `tournament.ts`: Tournaments + participants/invites.
- `team.ts`: Teams, team members, team tournament participants, and match team participants.
- `match.ts`: Matches and (user) match participants.
- `payment.ts` / `payout.ts`: Economic flows (entry payments & prize payouts).

### Shared Columns

`common.ts` exports helpers:

- `id`: UUID primary key with `defaultRandom()`.
- `timestamps`: `createdAt` + `updatedAt` with auto-update hook.

### Enum Typing via Zod

Business-state enums are defined in `packages/zod/src/*.ts` (e.g. `TournamentStatusEnum`,
`MatchStatusEnum`, `PaymentStatusEnum`). Tables use `.varchar().$type<EnumType>()` to ensure
insert/update type safety while remaining string-based at the database level.

### Relationships & Constraints Highlights

- `tournament_participant.userId` references `user.id` (cascade delete).
- `team_member.userId` references `user.id` with uniqueness partial indexes enforcing only one
  `CAPTAIN` and one `COACH` per team.
- `match_participant.matchId` & `match_team_participant.matchId` reference `match.id` (cascade
  delete).
- Economic tables (`payment`, `payout`) reference participants / tournaments for integrity.

## Seeding Architecture

The entry point is `packages/db/seed/_index.ts` which:

1. Parses CLI flags: `--force`, `--users=`, `--teams=`, `--tournaments=`.
2. Optionally truncates tables (`--force`) in dependency-safe order using a single
   `TRUNCATE ... CASCADE` statement.
3. Executes individual seed modules in dependency order:
   - `seed-users` → creates users.
   - `seed-games` → inserts a fixed list of games.
   - `seed-teams` → creates teams + members referencing users.
   - `seed-tournaments` → creates tournaments referencing users & games; adds user and team
     participants.
   - `seed-matches` → generates matches + participant links within each tournament.
   - `seed-finance` → creates payments (user entry fees) and payouts (winner prizes).
4. Prints a JSON summary of inserted counts and duration.

### Individual Seed Modules

Each module returns a structured result for downstream usage (e.g. tournaments + participants
feed into matches and finance seeds). Types use `typeof table.$inferInsert` for strong,
schema-driven shapes.

Module notes:

- `seed-users`: Generates realistic profile fields and roles.
- `seed-games`: Simple static set (Dota 2, Valorant, CS2) with generated IDs.
- `seed-teams`: Random companies as team names; assigns member roles (`CAPTAIN`, optional
  `COACH`, `MEMBER`).
- `seed-tournaments`: Random composition of game, region, format, status, type; builds user and
  team participant pools.
- `seed-matches`: For each tournament, creates a variable number of matches with randomized
  status & participant pairings.
- `seed-finance`: Random subset of user participants pay entry fees; random tournaments produce
  payouts to top participants.

### Helper Utilities

`helpers.ts` centralizes randomness helpers:

- `pick<T>(arr: readonly T[])`: Safe picker (throws on empty input).
- `times(n, fn)`: Simple repeat factory.
- `randomPastDate(days)` / `randomFutureDate(days)`: Date generation windows.
- `regions`: Tuple of region codes used by tournaments.

## Execution & Typing Details

- Uses `pg.Pool` + `drizzle(pool, { schema, casing: 'snake_case' })` for full schema typing.
- Truncation operates on all data tables and resets identity counters to ensure deterministic
  ID sequencing (if not manually overriding IDs).
- Seed ordering strictly respects foreign keys (users before teams; games before tournaments;
  tournaments before matches/payouts). Avoid reordering without adjusting dependencies.

## Customization

You can tailor the seed process:

- Counts: Override defaults via CLI flags (`--users=80 --teams=15`).
- Partial runs: Create specialized entry scripts (e.g. `seed-teams-only.ts`) that reuse
  modules.
- Determinism: Introduce `--seed=<number>` and call `faker.seed(value)` before generation.
- Transactions: Wrap logically grouped inserts per module in a transaction for speed; current
  approach relies on bulk multi-row `INSERT` statements.
- Performance: For very large counts, batch arrays (e.g. chunk matches) to keep payload sizes
  manageable.

## Extending Schema & Seed Data

When adding a new table:

1. Define table in `schema/` with proper FK references and include in `db-schema.ts` exports.
2. Add relevant enum(s) to `packages/zod` if modeling statuses.
3. Create a `seed-<entity>.ts` module returning its inserted rows.
4. Update orchestrator order in `_index.ts` ensuring upstream dependencies exist before seeding
   the new table.
5. Run `bunx tsc --noEmit -p packages/db/tsconfig.json` to validate typing.

## Safety & Reset

- `--force` truncation is destructive: never use against production data.
- Consider environment gating (e.g. require `NODE_ENV !== 'production'` before allowing
  `--force`).
- If you need partial resets (e.g. only matches), implement targeted `DELETE` statements rather
  than full truncation.

## Troubleshooting

| Symptom                                          | Cause                                   | Fix                                                                                      |
| ------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| TypeScript complaining about enum / role strings | Missing literal union casting           | Ensure generated values match the declared union (see team roles fix)                    |
| Insert overload mismatch in Drizzle              | Array shape not matching `$inferInsert` | Double-check property names and optional fields (avoid `undefined` for required columns) |
| Foreign key violations                           | Seeding order changed                   | Restore original ordering or defer dependent inserts until parents exist                 |
| Long runtime for large counts                    | Huge match/participant batches          | Chunk inserts or use transactions                                                        |

## Summary

The seeding system is modular, type-driven, and ordered to respect relational constraints.
Adjust counts/flags for local realism, add determinism as needed, and extend via new schema +
seed modules following established patterns.

---

_Last updated: 2025-10-30_
