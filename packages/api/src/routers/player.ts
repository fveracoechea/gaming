import { db, schema } from '@gaming/db';
import { SearchPlayersSchema } from '@gaming/zod';
import { ilike, or } from 'drizzle-orm';

import { procedures as p } from '../procedure';

/**
 * See a team by ID along with its members.
 * */
export const search = p.protected.input(SearchPlayersSchema).handler(async ({ input }) => {
  const players = await db.query.user.findMany({
    where: or(
      ilike(schema.user.name, `%${input.query}%`),
      ilike(schema.user.image, `%${input.query}%`),
    ),
  });
  return players;
});
