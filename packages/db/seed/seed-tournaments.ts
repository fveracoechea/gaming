import { faker } from '@faker-js/faker';
import { TeamTournamentParticipantStatusEnum } from '@gaming/zod/team';
import {
  TournamentFormatEnum,
  TournamentParticipantStatusEnum,
  TournamentStatusEnum,
  TournamentTypeEnum,
} from '@gaming/zod/tournaments';

import {
  tournament,
  tournamentParticipant,
  tournamentTeamParticipant,
} from '../src/db-schema';
import { pick, randomFutureDate, randomPastDate, regions } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedTournamentsResult {
  tournaments: (typeof tournament.$inferInsert)[];
  userParticipants: (typeof tournamentParticipant.$inferInsert)[];
  teamParticipants: (typeof tournamentTeamParticipant.$inferInsert)[];
}

export async function seedTournaments(
  db: DrizzleDB,
  users: { id: string }[],
  games: { id: string; name: string }[],
  teams: { id: string }[],
  count: number,
) {
  const tournaments = Array.from({ length: count }, (_, i) => {
    const organizer = pick(users);
    const gameEntry = pick(games);
    const status = pick(TournamentStatusEnum.options);
    const startsAt = randomFutureDate(20);
    return {
      id: faker.string.uuid(),
      organizerId: organizer.id,
      gameId: gameEntry.id,
      title: `${gameEntry.name} ${faker.word.noun()} Cup ${2025 + i}`,
      description: faker.lorem.paragraph(),
      region: pick(regions),
      format: pick(TournamentFormatEnum.options),
      status,
      type: pick(TournamentTypeEnum.options),
      entryFeeCents: faker.number.int({ min: 0, max: 2000 }),
      prizePoolLogic: 'STANDARD_POT',
      registrationLimit: faker.number.int({ min: 16, max: 64 }),
      startsAt,
      endsAt: new Date(startsAt.getTime() + 1000 * 60 * 60 * 24),
      registrationOpensAt: randomPastDate(5),
      registrationClosesAt: randomFutureDate(5),
      publishedAt: status !== 'DRAFT' ? randomPastDate(3) : null,
      createdAt: randomPastDate(7),
      updatedAt: new Date(),
    };
  });
  await db.insert(tournament).values(tournaments);
  console.log(`seed-tournaments: inserted ${tournaments.length} tournaments`);

  const userParticipants: (typeof tournamentParticipant.$inferInsert)[] = [];
  const teamParticipants: (typeof tournamentTeamParticipant.$inferInsert)[] = [];

  for (const t of tournaments) {
    const participantUsers = faker.helpers
      .shuffle(users)
      .slice(0, faker.number.int({ min: 8, max: 24 }));
    participantUsers.forEach(u => {
      userParticipants.push({
        id: faker.string.uuid(),
        tournamentId: t.id,
        userId: u.id,
        status: pick(TournamentParticipantStatusEnum.options),
        placement: undefined,
        earningsCents: 0,
        createdAt: randomPastDate(3),
        updatedAt: new Date(),
      });
    });

    const minTeams = Math.min(teams.length, 4);
    const maxTeams = Math.min(teams.length, 12);
    const teamCount = faker.number.int({ min: minTeams, max: Math.max(minTeams, maxTeams) });
    const participantTeams = faker.helpers.shuffle(teams).slice(0, teamCount);
    participantTeams.forEach(tm => {
      teamParticipants.push({
        id: faker.string.uuid(),
        tournamentId: t.id,
        teamId: tm.id,
        status: pick(TeamTournamentParticipantStatusEnum.options),
        placement: undefined,
        earningsCents: 0,
        createdAt: randomPastDate(3),
        updatedAt: new Date(),
      });
    });
  }

  await db.insert(tournamentParticipant).values(userParticipants);
  await db.insert(tournamentTeamParticipant).values(teamParticipants);
  console.log(`seed-tournaments: inserted ${userParticipants.length} user participants`);
  console.log(`seed-tournaments: inserted ${teamParticipants.length} team participants`);

  return { tournaments, userParticipants, teamParticipants };
}
