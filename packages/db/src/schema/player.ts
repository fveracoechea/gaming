import * as t from 'drizzle-orm/pg-core';

import { id, timestamps } from '../common';
import { user } from './auth';

/**
 * Player profile information
 * Stores extended profile data for players including stats
 * One-to-one relationship with user table
 */
export const playerProfile = t.pgTable('player_profile', {
  id,
  userId: t
    .text()
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  description: t.text(),
  tournamentsWon: t.integer().default(0).notNull(),
  tournamentsPlayed: t.integer().default(0).notNull(),
  ...timestamps,
});
