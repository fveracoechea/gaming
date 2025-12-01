import { faker } from '@faker-js/faker';
import type { InboxData } from '@gaming/zod/inbox';
import type { TeamMemberRole } from '@gaming/zod/team';

import { inbox } from '../src/db-schema';
import { pick, randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedInboxMessagesInput {
  users: { id: string; name: string; image: string | null }[];
  teams: { id: string; name: string; logoUrl: string | null }[];
  tournaments: { id: string; title: string }[];
}

export interface SeedInboxMessagesResult {
  inboxMessages: (typeof inbox.$inferInsert)[];
}

/**
 * Generate realistic inbox message data based on message type
 */
function generateInboxData(type: InboxData['type'], input: SeedInboxMessagesInput): InboxData {
  const { teams, users, tournaments } = input;

  switch (type) {
    case 'TEAM_INVITE': {
      const team = pick(teams);
      const inviter = pick(users);
      return {
        type: 'TEAM_INVITE',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        invitedByUser: {
          id: inviter.id,
          name: inviter.name,
          image: inviter.image || undefined,
          role: pick(['PLAYER', 'COACH'] as const),
        },
      };
    }

    case 'TEAM_INVITE_ACCEPTED': {
      const team = pick(teams);
      const invitedUser = pick(users);
      return {
        type: 'TEAM_INVITE_ACCEPTED',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        invitedUser: {
          id: invitedUser.id,
          name: invitedUser.name,
          image: invitedUser.image || undefined,
          role: pick(['PLAYER', 'COACH'] as const),
        },
      };
    }

    case 'TEAM_INVITE_REJECTED': {
      const team = pick(teams);
      const invitedUser = pick(users);
      return {
        type: 'TEAM_INVITE_REJECTED',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        invitedUser: {
          id: invitedUser.id,
          name: invitedUser.name,
          image: invitedUser.image || undefined,
          role: pick(['PLAYER', 'COACH'] as const),
        },
      };
    }

    case 'TEAM_ROLE_UPDATE': {
      const team = pick(teams);
      const user = pick(users);
      return {
        type: 'TEAM_ROLE_UPDATE',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        user: {
          id: user.id,
          name: user.name,
          image: user.image || undefined,
          role: pick(['CAPTAIN', 'PLAYER', 'COACH'] as TeamMemberRole[]),
        },
      };
    }

    case 'TEAM_REMOVED': {
      const team = pick(teams);
      const user = pick(users);
      return {
        type: 'TEAM_REMOVED',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        user: {
          id: user.id,
          name: user.name,
          image: user.image || undefined,
        },
      };
    }

    case 'TOURNAMENT_JOIN_REQUEST': {
      const team = pick(teams);
      return {
        type: 'TOURNAMENT_JOIN_REQUEST',
        team: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
      };
    }

    case 'TOURNAMENT_INVITE': {
      const team = pick(teams);
      const tournament = pick(tournaments);
      return {
        type: 'TOURNAMENT_INVITE',
        invitedByTeam: {
          id: team.id,
          name: team.name,
          image: team.logoUrl || undefined,
        },
        tournament: {
          id: tournament.id,
          name: tournament.title,
          image: undefined, // Tournaments don't have images in current schema
        },
      };
    }

    default:
      // This should never happen due to the messageTypes array
      throw new Error(`Unknown inbox message type: ${type}`);
  }
}

export async function seedInboxMessages(
  db: DrizzleDB,
  input: SeedInboxMessagesInput,
): Promise<SeedInboxMessagesResult> {
  const { users } = input;

  const messageTypes: InboxData['type'][] = [
    'TEAM_INVITE',
    'TEAM_INVITE_ACCEPTED',
    'TEAM_INVITE_REJECTED',
    'TEAM_ROLE_UPDATE',
    'TEAM_REMOVED',
    'TOURNAMENT_JOIN_REQUEST',
    'TOURNAMENT_INVITE',
  ];

  // Generate 3-10 messages per user
  const messages = users.flatMap(user => {
    const messageCount = faker.number.int({ min: 3, max: 10 });
    return Array.from({ length: messageCount }, () => {
      const type = pick(messageTypes);
      const createdAt = randomPastDate(30);

      // 60% chance message has been read
      const hasBeenRead = faker.datatype.boolean({ probability: 0.6 });
      const readAt = hasBeenRead
        ? faker.date.between({ from: createdAt, to: new Date() })
        : null;

      return {
        id: faker.string.uuid(),
        userId: user.id,
        data: generateInboxData(type, input),
        readAt,
        createdAt,
        updatedAt: readAt || createdAt,
      };
    });
  });

  await db.insert(inbox).values(messages);
  console.log(`seed-inbox: inserted ${messages.length} inbox messages`);
  return { inboxMessages: messages };
}
