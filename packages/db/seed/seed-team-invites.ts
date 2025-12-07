import { faker } from '@faker-js/faker';

import { teamInvite } from '../src/db-schema';
import { pick, randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedTeamInvitesResult {
  teamInvites: (typeof teamInvite.$inferInsert)[];
}

interface SeedTeamInvitesInput {
  teams: Array<{ id: string; captainId: string }>;
  users: Array<{ id: string }>;
  invitesPerTeam?: number;
}

/**
 * Seeds team invites with a mix of PENDING, ACCEPTED, REJECTED, and WITHDRAWN statuses.
 * Creates realistic invite scenarios for testing the invite system.
 */
export async function seedTeamInvites(
  db: DrizzleDB,
  { teams, users, invitesPerTeam = 3 }: SeedTeamInvitesInput,
): Promise<SeedTeamInvitesResult> {
  const statuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'] as const;
  const roles = ['PLAYER', 'COACH'] as const;

  // Get all existing team member user IDs to avoid duplicate invites
  const existingMemberIds = new Set(
    teams.flatMap(t => users.filter(u => faker.datatype.boolean()).map(u => u.id)),
  );

  const teamInvites = teams.flatMap(team => {
    // Get available users for this team (not already members)
    const availableUsers = users.filter(u => u.id !== team.captainId);

    // Randomly select 2-5 users to invite per team
    const inviteCount = faker.number.int({
      min: 2,
      max: Math.min(invitesPerTeam, availableUsers.length),
    });
    const invitedUsers = faker.helpers.shuffle(availableUsers).slice(0, inviteCount);

    return invitedUsers.map(user => {
      // Weight towards PENDING invites for realistic testing (60% pending, 40% other statuses)
      const isPending = faker.datatype.boolean({ probability: 0.6 });
      const status = isPending ? 'PENDING' : pick(statuses);

      return {
        id: faker.string.uuid(),
        teamId: team.id,
        invitedUserId: user.id,
        invitedByUserId: team.captainId,
        role: pick(roles),
        status,
        createdAt: randomPastDate(status === 'PENDING' ? 7 : 30), // Pending invites are more recent
        updatedAt: new Date(),
      };
    });
  });

  if (teamInvites.length > 0) {
    await db.insert(teamInvite).values(teamInvites);
    console.log(`seed-team-invites: inserted ${teamInvites.length} team invites`);
  } else {
    console.log('seed-team-invites: no invites to insert');
  }

  // Log status breakdown
  const statusCounts = teamInvites.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  console.log('seed-team-invites: status breakdown:', statusCounts);

  return { teamInvites };
}
