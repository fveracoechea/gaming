import { faker } from '@faker-js/faker';

import { playerProfile } from '../src/db-schema';
import type { DrizzleDB } from './types';

export interface SeedPlayerProfilesResult {
  playerProfiles: (typeof playerProfile.$inferInsert)[];
}

export async function seedPlayerProfiles(
  db: DrizzleDB,
  userIds: string[],
): Promise<SeedPlayerProfilesResult> {
  const rows = userIds.map(userId => ({
    id: faker.string.uuid(),
    userId,
    description: faker.helpers.maybe(() => faker.lorem.paragraph(), { probability: 0.7 }),
    tournamentsWon: faker.number.int({ min: 0, max: 20 }),
    tournamentsPlayed: faker.number.int({ min: 0, max: 100 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(playerProfile).values(rows);
  console.log(`seed-player-profiles: inserted ${rows.length} player profiles`);
  return { playerProfiles: rows };
}
