import { db } from '@gaming/db';
import { schema } from '@gaming/db';
import { CreateTeamSchema } from '@gaming/zod';
import { ORPCError } from '@orpc/client';
import { and, eq } from 'drizzle-orm';
import z from 'zod';

import { procedures as p } from '../procedure';

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
  .input(CreateTeamSchema)
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

    if (teamCount > 1) throw errors.FORBIDDEN();

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

export const edit = p.protected
  .input(z.object({ teamId: z.uuid(), update: CreateTeamSchema }))
  .errors({
    NOT_FOUND: {
      message: 'Team not found',
    },
    FORBIDDEN: {
      message: 'Only team captains can edit team details',
    },
  })
  .handler(async ({ errors, input: { teamId, update }, context }) => {
    const { user } = context.auth;

    const doesTeamExist = !!(await db.query.team.findFirst({
      columns: { id: true },
      where: eq(schema.team.id, teamId),
    }));

    if (!doesTeamExist) throw errors.NOT_FOUND();

    const isCaptain = !!(await db.query.teamMember.findFirst({
      columns: { id: true },
      where: and(
        eq(schema.teamMember.userId, user.id),
        eq(schema.teamMember.teamId, teamId),
        eq(schema.teamMember.role, 'CAPTAIN'),
      ),
    }));

    if (!isCaptain) throw errors.FORBIDDEN();

    const [team] = await db
      .update(schema.team)
      .set(update)
      .where(eq(schema.team.id, teamId))
      .returning();

    return team!;
  });
