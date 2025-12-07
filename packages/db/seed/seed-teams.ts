import { faker } from '@faker-js/faker';

import { team, teamMember } from '../src/db-schema';
import { randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedTeamsResult {
  teams: (typeof team.$inferInsert)[];
  teamMembers: (typeof teamMember.$inferInsert)[];
  teamsWithCaptains: Array<{ id: string; captainId: string }>;
}

export async function seedTeams(db: DrizzleDB, users: { id: string }[], teamCount: number) {
  const teams = Array.from({ length: teamCount }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    logoUrl: faker.image.urlPicsumPhotos(),
    createdAt: randomPastDate(10),
    updatedAt: new Date(),
  }));
  await db.insert(team).values(teams);
  console.log(`seed-teams: inserted ${teams.length} teams`);

  const teamMembers = teams.flatMap(t => {
    const memberCount = faker.number.int({ min: 4, max: 8 });
    const shuffled = faker.helpers.shuffle(users).slice(0, memberCount);
    return shuffled.map((u, idx) => ({
      id: faker.string.uuid(),
      teamId: t.id,
      userId: u.id,
      role: (idx === 0
        ? 'CAPTAIN'
        : idx === 1 && faker.datatype.boolean()
          ? 'COACH'
          : 'PLAYER') as 'CAPTAIN' | 'PLAYER' | 'COACH',
      createdAt: randomPastDate(10),
      updatedAt: new Date(),
    }));
  });
  await db.insert(teamMember).values(teamMembers);
  console.log(`seed-teams: inserted ${teamMembers.length} team members`);

  // Extract team-captain mappings for downstream use
  const teamsWithCaptains = teams.map(t => ({
    id: t.id,
    captainId: teamMembers.find(m => m.teamId === t.id && m.role === 'CAPTAIN')!.userId,
  }));

  return { teams, teamMembers, teamsWithCaptains };
}
