import type { PaymentStatus } from '@gaming/zod';
import * as t from 'drizzle-orm/pg-core';

import { id, timestamps } from './common';
import { tournamentParticipant } from './tournament';

/**
 * Tournament entry payments made by participants
 * links to tournament participants and records payment status, amount, etc.
 */
export const payment = t.pgTable('payment', {
  id,
  participantId: t
    .text()
    .notNull()
    .references(() => tournamentParticipant.id, { onDelete: 'cascade' }),
  amountCents: t.integer().notNull(),
  stripePaymentIntentId: t.varchar(),
  status: t.varchar().$type<PaymentStatus>().notNull().default('PENDING'),
  ...timestamps,
});
