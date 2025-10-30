import { db } from '@gaming/db';
import { schema } from '@gaming/db';
import { ORPCError } from '@orpc/client';
import { eq } from 'drizzle-orm';
import z from 'zod';

import { procedures as p } from '../procedure';

export const teamRouter = {
  /**
   * See a team by ID along with its members.
   * */
  findTeam: p.protected.input(z.uuid()).handler(async ({ input }) => {
    return db.query.team.findFirst({
      where: eq(schema.team.id, input),
      with: {
        members: true,
      },
    });
  }),
  /**
   * Create a new team and add the current user as a captain.
   * */
  create: p.protected
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().max(255).optional().nullable(),
      }),
    )
    .handler(async ({ input, context }) => {
      const { user } = context.session;
      const { name, description } = input;

      const teamCount = await db.$count(
        schema.teamMember,
        eq(schema.teamMember.userId, user.id),
      );

      if (teamCount > 1)
        throw new ORPCError('FORBIDDEN', {
          message: 'Cannot be part of more than one team, upgrade to Pro to join more teams.',
        });

      return db.transaction(async tx => {
        const [team] = await db
          .insert(schema.team)
          .values({
            name,
            description,
          })
          .returning();

        if (!team) throw new ORPCError('INTERNAL', { message: 'Failed to create team' });

        await db.insert(schema.teamMember).values({
          teamId: team.id,
          userId: user.id,
          role: 'CAPTAIN',
        });

        return team;
      });
    }),
};
