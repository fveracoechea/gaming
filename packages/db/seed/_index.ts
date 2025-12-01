/*
 * Database seeding orchestrator.
 * Uses modular seed functions to populate development/test data.
 * Supports: --force to truncate & reseed, configurable counts via --users=, --teams=, --tournaments=
 */
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../src/db-schema';
import { tournament } from '../src/db-schema';
import { seedFinance } from './seed-finance';
import { seedGames } from './seed-games';
import { seedInboxMessages } from './seed-inbox';
import { seedMatches } from './seed-matches';
import { seedPlayerProfiles } from './seed-player-profiles';
import { seedTeams } from './seed-teams';
import { seedTournaments } from './seed-tournaments';
import { seedUsers } from './seed-users';

let stage = 'local';
if (process.env.STAGE) stage = process.env.STAGE;

dotenv.config({
  path: '../../infra/.env.' + stage,
});

const DEFAULT_COUNTS = {
  users: 40,
  teams: 10,
  tournaments: 6,
};

interface CountsConfig {
  users: number;
  teams: number;
  tournaments: number;
}

function parseArgs(): { force: boolean; counts: CountsConfig } {
  const argv = process.argv.slice(2);
  let force = false;
  const counts: CountsConfig = { ...DEFAULT_COUNTS };
  for (const arg of argv) {
    if (arg === '--force') force = true;
    else if (arg.startsWith('--')) {
      const [rawKey, rawVal] = arg.slice(2).split('=');
      if (rawVal) {
        const key = rawKey as keyof CountsConfig;
        if (key in counts) {
          const parsed = Number(rawVal);
          if (!Number.isNaN(parsed) && parsed > 0) counts[key] = parsed;
        }
      }
    }
  }
  return { force, counts };
}

async function main() {
  const { force, counts } = parseArgs();
  const startTime = Date.now();

  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema, casing: 'snake_case' });

  // Detect prior seed state (heuristic: any tournaments?)
  const existing = await db.select().from(tournament).limit(1);
  if (existing.length && !force) {
    console.log('Database appears seeded; aborting (use --force to reseed).');
    await pool.end();
    return;
  }
  if (force) {
    console.log('Forced reseed requested -- truncating tables...');
    await db.execute(
      sql`TRUNCATE TABLE inbox, match_team_participant, match_participant, match, payment, payout, tournament_team_participant, tournament_participant, tournament_invite, team_member, team, player_profile, tournament, game RESTART IDENTITY CASCADE`,
    );
    console.log('Truncate complete.');
  }

  console.log('Seeding database...');

  // Order matters due to foreign keys
  const { users } = await seedUsers(db, counts.users);
  const { playerProfiles } = await seedPlayerProfiles(
    db,
    users.map(u => u.id),
  );
  const { games } = await seedGames(db);
  const { teams, teamMembers } = await seedTeams(db, users, counts.teams);
  const { tournaments, userParticipants, teamParticipants } = await seedTournaments(
    db,
    users,
    games,
    teams,
    counts.tournaments,
  );
  const { matches, matchUserParticipants, matchTeamParticipants } = await seedMatches(db, {
    tournaments: tournaments.map(t => ({ id: t.id })),
    userParticipants: userParticipants.map(p => ({ id: p.id!, tournamentId: p.tournamentId })),
    teamParticipants: teamParticipants.map(p => ({ id: p.id!, tournamentId: p.tournamentId })),
  });
  const { payments, payouts } = await seedFinance(
    db,
    tournaments.map(t => ({ id: t.id, organizerId: t.organizerId })),
    userParticipants.map(p => ({ id: p.id!, tournamentId: p.tournamentId })),
  );
  const { inboxMessages } = await seedInboxMessages(db, {
    users: users.map(u => ({ id: u.id, name: u.name, image: u.image })),
    teams: teams.map(t => ({ id: t.id, name: t.name, logoUrl: t.logoUrl })),
    tournaments: tournaments.map(t => ({ id: t.id, title: t.title })),
  });

  const durationMs = Date.now() - startTime;
  console.log('Seeding complete.');

  const summary = {
    counts,
    users: users.length,
    playerProfiles: playerProfiles.length,
    games: games.length,
    teams: teams.length,
    teamMembers: teamMembers.length,
    tournaments: tournaments.length,
    userParticipants: userParticipants.length,
    teamParticipants: teamParticipants.length,
    matches: matches.length,
    matchUserParticipants: matchUserParticipants.length,
    matchTeamParticipants: matchTeamParticipants.length,
    payments: payments.length,
    payouts: payouts.length,
    inboxMessages: inboxMessages.length,
    forced: force,
    durationMs,
  };
  console.log('Summary:', JSON.stringify(summary, null, 2));

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
