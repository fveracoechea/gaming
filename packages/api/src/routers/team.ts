import type { Context } from '@/context';
import { db } from '@gaming/db';
import { schema } from '@gaming/db';
import {
  CreateOrUpdateTeamSchema,
  InvitePlayersToTeamSchema,
  RespondToInviteSchema,
  WithdrawInviteSchema,
} from '@gaming/zod';
import { ORPCError } from '@orpc/client';
import { os } from '@orpc/server';
import { and, eq, or } from 'drizzle-orm';
import z from 'zod';

import { procedures as p } from '../procedure';

/**
 * Middleware to check if the current user is a captain of the specified team.
 */
const isCaptainMiddleware = os
  .$context<{ auth: NonNullable<Context['auth']> }>()
  .middleware(async ({ context, next }, input: { teamId: string }) => {
    const { auth } = context;

    const isCaptain = !!(await db.query.teamMember.findFirst({
      columns: { id: true },
      where: and(
        eq(schema.teamMember.userId, auth.user.id),
        eq(schema.teamMember.teamId, input.teamId),
        eq(schema.teamMember.role, 'CAPTAIN'),
      ),
    }));

    return next({ context: { auth, isCaptain } });
  });

/**
 * See a team by ID along with its members.
 * */
export const findById = p.protected
  .input(z.uuid())
  .errors({ NOT_FOUND: { message: 'Team not found' } })
  .handler(async ({ input, errors }) => {
    const team = await db.query.team.findFirst({
      where: eq(schema.team.id, input),
      with: { members: { with: { user: true } } },
    });

    if (!team) throw errors.NOT_FOUND();
    return team;
  });

export const findMyTeams = p.protected.handler(async ({ context }) => {
  const { user } = context.auth;
  const data = await db.query.teamMember.findMany({
    where: eq(schema.teamMember.userId, user.id),
    with: {
      team: { with: { members: { with: { user: true } } } },
    },
  });
  return data.map(tm => tm.team);
});

/**
 * Create a new team and add the current user as a captain.
 * */
export const create = p.protected
  .input(CreateOrUpdateTeamSchema)
  .errors({
    FORBIDDEN: {
      message: 'Cannot be part of more than one team, upgrade to Pro to join more teams.',
    },
  })
  .handler(async ({ input, context, errors }) => {
    const { user } = context.auth;

    const teamCount = await db.$count(
      schema.teamMember,
      eq(schema.teamMember.userId, user.id),
    );

    if (teamCount >= 1) throw errors.FORBIDDEN();

    return await db.transaction(async tx => {
      const [team] = await tx.insert(schema.team).values(input).returning();
      if (!team) throw new ORPCError('INTERNAL', { message: 'Failed to create team' });

      await tx.insert(schema.teamMember).values({
        teamId: team.id,
        userId: user.id,
        role: 'CAPTAIN',
      });

      return team;
    });
  });

/**
 * Edit team details. Only captains can edit team details.
 */
export const edit = p.protected
  .input(z.object({ teamId: z.uuid(), update: CreateOrUpdateTeamSchema }))
  .use(isCaptainMiddleware)
  .errors({
    NOT_FOUND: {
      message: 'Team not found',
    },
    FORBIDDEN: {
      message: 'Only team captains can edit team details',
    },
  })
  .handler(async ({ errors, input: { teamId, update }, context: { isCaptain } }) => {
    const doesTeamExist = !!(await db.query.team.findFirst({
      columns: { id: true },
      where: eq(schema.team.id, teamId),
    }));

    if (!doesTeamExist) throw errors.NOT_FOUND();
    if (!isCaptain) throw errors.FORBIDDEN();

    const [team] = await db
      .update(schema.team)
      .set(update)
      .where(eq(schema.team.id, teamId))
      .returning();

    return team!;
  });

/**
 * Delete a team by ID. Only captains can delete the team.
 */
export const deleteById = p.protected
  .input(z.object({ teamId: z.uuid() }))
  .use(isCaptainMiddleware)
  .errors({
    NOT_FOUND: {
      message: 'Team not found',
    },
    FORBIDDEN: {
      message: 'Only team captain can delete the team',
    },
  })
  .handler(async ({ input: { teamId }, context: { isCaptain }, errors }) => {
    const team = await db.query.team.findFirst({
      columns: { id: true, name: true },
      where: eq(schema.team.id, teamId),
    });

    if (!team) throw errors.NOT_FOUND();
    if (!isCaptain) throw errors.FORBIDDEN();

    await db.delete(schema.team).where(eq(schema.team.id, teamId));
    return { message: `Team ${team.name} has been deleted` };
  });

/**
 * Send invites to players to join the team. Only captains can send invites.
 */
export const sendInvites = p.protected
  .input(InvitePlayersToTeamSchema)
  .use(isCaptainMiddleware)
  .errors({
    NOT_FOUND: {
      message: 'Team not found',
    },
    FORBIDDEN: {
      message: 'Only team captains can send invites',
    },
    CONFLICT: {
      message: 'One or more players are already members or have pending invites',
    },
  })
  .handler(async ({ input: { teamId, players }, context: { auth, isCaptain }, errors }) => {
    const team = await db.query.team.findFirst({
      columns: { id: true, name: true, logoUrl: true },
      where: eq(schema.team.id, teamId),
    });

    if (!team) throw errors.NOT_FOUND();
    if (!isCaptain) throw errors.FORBIDDEN();

    // Check for existing members or pending invites
    const playerIds = players.map(p => p.id);
    const [existingMembers, existingInvites] = await Promise.all([
      db.query.teamMember.findMany({
        columns: { userId: true },
        where: and(
          eq(schema.teamMember.teamId, teamId),
          or(...playerIds.map(id => eq(schema.teamMember.userId, id))),
        ),
      }),
      db.query.teamInvite.findMany({
        columns: { invitedUserId: true },
        where: and(
          eq(schema.teamInvite.teamId, teamId),
          eq(schema.teamInvite.status, 'PENDING'),
          or(...playerIds.map(id => eq(schema.teamInvite.invitedUserId, id))),
        ),
      }),
    ]);

    if (existingMembers.length > 0 || existingInvites.length > 0) {
      throw errors.CONFLICT();
    }

    // Get captain user info for inbox messages
    const captain = await db.query.user.findFirst({
      columns: { id: true, name: true, image: true },
      where: eq(schema.user.id, auth.user.id),
    });

    // Create invites and inbox messages in a transaction
    return await db.transaction(async tx => {
      const invites = await tx
        .insert(schema.teamInvite)
        .values(
          players.map(player => ({
            teamId,
            invitedUserId: player.id,
            invitedByUserId: auth.user.id,
            role: player.role,
            status: 'PENDING' as const,
          })),
        )
        .returning();

      // Create inbox messages for each invited player
      await tx.insert(schema.inbox).values(
        players.map(player => ({
          userId: player.id,
          data: {
            type: 'TEAM_INVITE' as const,
            team: {
              id: team.id,
              name: team.name,
              image: team.logoUrl,
            },
            invitedByUser: {
              id: captain!.id,
              name: captain!.name,
              image: captain!.image,
              role: player.role,
            },
          },
        })),
      );

      return {
        message: `Successfully sent ${invites.length} invite(s)`,
        invites,
      };
    });
  });

/**
 * List all invites for a team (for captains to see status)
 */
export const listTeamInvites = p.protected
  .input(z.object({ teamId: z.uuid() }))
  .use(isCaptainMiddleware)
  .errors({
    NOT_FOUND: {
      message: 'Team not found',
    },
    FORBIDDEN: {
      message: 'Only team captains can view invites',
    },
  })
  .handler(async ({ input: { teamId }, context: { isCaptain }, errors }) => {
    const team = await db.query.team.findFirst({
      columns: { id: true },
      where: eq(schema.team.id, teamId),
    });

    if (!team) throw errors.NOT_FOUND();
    if (!isCaptain) throw errors.FORBIDDEN();

    const invites = await db.query.teamInvite.findMany({
      where: eq(schema.teamInvite.teamId, teamId),
      with: {
        invitedUser: {
          columns: { id: true, name: true, email: true },
        },
        invitedByUser: {
          columns: { id: true, name: true },
        },
      },
      orderBy: (invite, { desc }) => [desc(invite.createdAt)],
    });

    return invites;
  });

/**
 * List all invites received by the current user
 */
export const listMyInvites = p.protected.handler(async ({ context }) => {
  const { user } = context.auth;

  const invites = await db.query.teamInvite.findMany({
    where: and(
      eq(schema.teamInvite.invitedUserId, user.id),
      eq(schema.teamInvite.status, 'PENDING'),
    ),
    with: {
      team: true,
      invitedByUser: {
        columns: { id: true, name: true },
      },
    },
    orderBy: (invite, { desc }) => [desc(invite.createdAt)],
  });

  return invites;
});

/**
 * Accept or reject an invite (for invited players)
 */
export const respondToInvite = p.protected
  .input(RespondToInviteSchema)
  .errors({
    NOT_FOUND: {
      message: 'Invite not found',
    },
    FORBIDDEN: {
      message: 'You are not authorized to respond to this invite',
    },
    CONFLICT: {
      message: 'This invite has already been responded to',
    },
    LIMIT_EXCEEDED: {
      message: 'Cannot be part of more than one team, upgrade to Pro to join more teams.',
    },
  })
  .handler(async ({ input: { inviteId, action }, context, errors }) => {
    const { user } = context.auth;

    const invite = await db.query.teamInvite.findFirst({
      where: eq(schema.teamInvite.id, inviteId),
      with: { team: true },
    });

    if (!invite) throw errors.NOT_FOUND();
    if (invite.invitedUserId !== user.id) throw errors.FORBIDDEN();
    if (invite.status !== 'PENDING') throw errors.CONFLICT();

    // Get captain to notify
    const captain = await db.query.teamMember.findFirst({
      where: and(
        eq(schema.teamMember.teamId, invite.teamId),
        eq(schema.teamMember.role, 'CAPTAIN'),
      ),
      with: {
        user: {
          columns: { id: true, name: true, image: true },
        },
      },
    });

    // Get current user info for inbox message

    if (action === 'accept') {
      // Check team limit
      const teamCount = await db.$count(
        schema.teamMember,
        eq(schema.teamMember.userId, user.id),
      );

      if (teamCount >= 1) throw errors.LIMIT_EXCEEDED();

      // Accept the invite and add to team
      return await db.transaction(async tx => {
        await tx
          .update(schema.teamInvite)
          .set({ status: 'ACCEPTED', updatedAt: new Date() })
          .where(eq(schema.teamInvite.id, inviteId));

        await tx.insert(schema.teamMember).values({
          teamId: invite.teamId,
          userId: user.id,
          role: invite.role,
        });

        // Notify captain that player accepted
        if (captain) {
          await tx.insert(schema.inbox).values({
            userId: captain.userId,
            data: {
              type: 'TEAM_INVITE_ACCEPTED' as const,
              team: {
                id: invite.team.id,
                name: invite.team.name,
                image: invite.team.logoUrl,
              },
              invitedUser: {
                id: user.id,
                name: user.name,
                image: user.image,
                role: invite.role,
              },
            },
          });
        }

        return {
          message: `You have joined ${invite.team.name}!`,
          team: invite.team,
        };
      });
    } else {
      // Reject the invite
      return await db.transaction(async tx => {
        await tx
          .update(schema.teamInvite)
          .set({ status: 'REJECTED', updatedAt: new Date() })
          .where(eq(schema.teamInvite.id, inviteId));

        // Notify captain that player rejected
        if (captain) {
          await tx.insert(schema.inbox).values({
            userId: captain.userId,
            data: {
              type: 'TEAM_INVITE_REJECTED',
              team: {
                id: invite.team.id,
                name: invite.team.name,
                image: invite.team.logoUrl,
              },
              invitedUser: {
                id: user.id,
                name: user.name,
                image: user.image,
                role: invite.role,
              },
            },
          });
        }

        return { message: 'Invite rejected' };
      });
    }
  });

/**
 * Withdraw a pending invite (for captains)
 */
export const withdrawInvite = p.protected
  .input(WithdrawInviteSchema)
  .errors({
    NOT_FOUND: {
      message: 'Invite not found',
    },
    FORBIDDEN: {
      message: 'Only team captains can withdraw invites',
    },
    CONFLICT: {
      message: 'This invite cannot be withdrawn',
    },
  })
  .handler(async ({ input: { inviteId }, context, errors }) => {
    const { user } = context.auth;

    const invite = await db.query.teamInvite.findFirst({
      where: eq(schema.teamInvite.id, inviteId),
      with: { team: true },
    });

    if (!invite) throw errors.NOT_FOUND();
    if (invite.status !== 'PENDING') throw errors.CONFLICT();

    // Check if user is captain of the team
    const isCaptain = !!(await db.query.teamMember.findFirst({
      columns: { id: true },
      where: and(
        eq(schema.teamMember.userId, user.id),
        eq(schema.teamMember.teamId, invite.teamId),
        eq(schema.teamMember.role, 'CAPTAIN'),
      ),
    }));

    if (!isCaptain) throw errors.FORBIDDEN();

    // Withdraw invite and notify player
    return await db.transaction(async tx => {
      await tx
        .update(schema.teamInvite)
        .set({ status: 'WITHDRAWN', updatedAt: new Date() })
        .where(eq(schema.teamInvite.id, inviteId));

      // Notify player that invite was withdrawn
      await tx.insert(schema.inbox).values({
        userId: invite.invitedUserId,
        data: {
          type: 'TEAM_INVITE_WITHDRAWN',
          team: {
            id: invite.team.id,
            name: invite.team.name,
            image: invite.team.logoUrl,
          },
          withdrawnBy: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        },
      });

      return { message: 'Invite withdrawn successfully' };
    });
  });
