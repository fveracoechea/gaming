import { faker } from '@faker-js/faker';
import { MatchStatusEnum } from '@gaming/zod/match';

import { match, matchParticipant, matchTeamParticipant } from '../src/db-schema';
import { pick, randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedMatchesResult {
  matches: (typeof match.$inferInsert)[];
  matchUserParticipants: (typeof matchParticipant.$inferInsert)[];
  matchTeamParticipants: (typeof matchTeamParticipant.$inferInsert)[];
}

interface TournamentScope {
  tournaments: { id: string }[];
  userParticipants: { id: string; tournamentId: string }[];
  teamParticipants: { id: string; tournamentId: string }[];
}

export async function seedMatches(db: DrizzleDB, scope: TournamentScope) {
  const matchRows: (typeof match.$inferInsert)[] = [];
  const matchUserParticipants: (typeof matchParticipant.$inferInsert)[] = [];
  const matchTeamParticipants: (typeof matchTeamParticipant.$inferInsert)[] = [];

  for (const t of scope.tournaments) {
    const userParts = scope.userParticipants.filter(p => p.tournamentId === t.id);
    const teamParts = scope.teamParticipants.filter(p => p.tournamentId === t.id);
    const totalMatches = faker.number.int({ min: 5, max: 15 });
    for (let m = 0; m < totalMatches; m++) {
      const matchId = faker.string.uuid();
      const status = pick(MatchStatusEnum.options);
      matchRows.push({
        id: matchId,
        tournamentId: t.id,
        round: faker.number.int({ min: 1, max: 5 }),
        sequence: m + 1,
        status,
        winnerParticipantId: null,
        dotaMatchId: null,
        openDotaMatchId: null,
        replayUrl: null,
        startedAt:
          status === 'IN_PROGRESS' || status === 'COMPLETED' ? randomPastDate(2) : null,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        createdAt: randomPastDate(2),
        updatedAt: new Date(),
      });

      if (userParts.length >= 2) {
        const two = faker.helpers.shuffle(userParts).slice(0, 2);
        two.forEach((p, idx) => {
          matchUserParticipants.push({
            id: faker.string.uuid(),
            matchId,
            participantId: p.id,
            seed: idx + 1,
            score: status === 'COMPLETED' ? faker.number.int({ min: 0, max: 2 }) : 0,
            createdAt: randomPastDate(2),
            updatedAt: new Date(),
          });
        });
      }

      if (teamParts.length >= 2) {
        const twoTeams = faker.helpers.shuffle(teamParts).slice(0, 2);
        twoTeams.forEach((tp, idx) => {
          matchTeamParticipants.push({
            id: faker.string.uuid(),
            matchId,
            teamParticipantId: tp.id,
            seed: idx + 1,
            score: status === 'COMPLETED' ? faker.number.int({ min: 0, max: 2 }) : 0,
            createdAt: randomPastDate(2),
            updatedAt: new Date(),
          });
        });
      }
    }
  }

  await db.insert(match).values(matchRows);
  await db.insert(matchParticipant).values(matchUserParticipants);
  await db.insert(matchTeamParticipant).values(matchTeamParticipants);
  console.log(`seed-matches: inserted ${matchRows.length} matches`);
  console.log(
    `seed-matches: inserted ${matchUserParticipants.length} match user participants`,
  );
  console.log(
    `seed-matches: inserted ${matchTeamParticipants.length} match team participants`,
  );

  return { matches: matchRows, matchUserParticipants, matchTeamParticipants };
}
