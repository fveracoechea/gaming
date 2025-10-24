import type { PayoutStatus } from '@gaming/zod';
import * as t from 'drizzle-orm/pg-core';

import { id, timestamps } from '../common';
import { user } from './auth';
import { tournament, tournamentParticipant } from './tournament';

/**
 * Tournament payouts to organizers or participants
 * links to tournaments, participants, and organizers, and records payout status, amount, etc.
 */
export const payout = t.pgTable('payout', {
  id,
  tournamentId: t
    .uuid()
    .notNull()
    .references(() => tournament.id, { onDelete: 'cascade' }),
  participantId: t.uuid().references(() => tournamentParticipant.id, {
    onDelete: 'set null',
  }),
  organizerId: t.text().references(() => user.id, { onDelete: 'set null' }),
  type: t.varchar().notNull(),
  amountCents: t.integer().notNull(),
  status: t.varchar().$type<PayoutStatus>().notNull().default('PENDING'),
  ...timestamps,
});
