import { procedures as p } from '@/procedure';
import { db } from '@gaming/db';
import { schema } from '@gaming/db';
import { eq } from 'drizzle-orm';
import z from 'zod';

export const todoRouter = {
  findTeam: p.protected.input(z.uuid()).handler(async ({ input }) => {
    return db.query.team.findFirst({
      where: eq(schema.team.id, input),
      with: {
        members: true,
      },
    });
  }),

  create: p.protected
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().max(255).optional().nullable(),
      }),
    )
    .handler(async ({ input, context }) => {
      const { name, description } = input;

      return db.transaction(async tx => {
        return await db
          .insert(schema.team)
          .values({
            name,
            description,
          })
          .returning();
      });
    }),
};
