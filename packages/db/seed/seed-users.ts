import { faker } from '@faker-js/faker';

import { user } from '../src/db-schema';
import { randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedUsersResult {
  users: (typeof user.$inferInsert)[];
}

export async function seedUsers(db: DrizzleDB, count: number) {
  const rows = Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    image: faker.image.avatar(),
    username: faker.internet.username().toLowerCase(),
    displayUsername: faker.internet.displayName(),
    role: faker.helpers.arrayElement(['USER', 'ADMIN', 'MODERATOR']),
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: randomPastDate(15),
    updatedAt: new Date(),
  }));
  await db.insert(user).values(rows);
  console.log(`seed-users: inserted ${rows.length} users`);
  return { users: rows };
}
