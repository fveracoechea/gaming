import { faker } from '@faker-js/faker';

import { game } from '../src/db-schema';
import type { DrizzleDB } from './types';

export interface SeedGamesResult {
  games: (typeof game.$inferInsert)[];
}

export async function seedGames(db: DrizzleDB) {
  const rows = [
    {
      id: faker.string.uuid(),
      name: 'Dota 2',
      slug: 'dota2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: faker.string.uuid(),
      name: 'Valorant',
      slug: 'valorant',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: faker.string.uuid(),
      name: 'Counter-Strike 2',
      slug: 'cs2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.insert(game).values(rows);
  console.log(`seed-games: inserted ${rows.length} games`);
  return { games: rows };
}
