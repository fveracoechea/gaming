import { faker } from '@faker-js/faker';
import { PaymentStatusEnum } from '@gaming/zod/payment';
import { PayoutStatusEnum } from '@gaming/zod/payout';

import { payment, payout } from '../src/db-schema';
import { pick, randomPastDate } from './helpers';
import type { DrizzleDB } from './types';

export interface SeedFinanceResult {
  payments: (typeof payment.$inferInsert)[];
  payouts: (typeof payout.$inferInsert)[];
}

export async function seedFinance(
  db: DrizzleDB,
  tournaments: { id: string; organizerId: string }[],
  userParticipants: { id: string; tournamentId: string }[],
) {
  const paymentRows = userParticipants
    .filter(() => faker.datatype.boolean())
    .map(p => ({
      id: faker.string.uuid(),
      participantId: p.id,
      amountCents: faker.number.int({ min: 0, max: 2000 }),
      stripePaymentIntentId: faker.datatype.boolean() ? faker.string.uuid() : null,
      status: pick(PaymentStatusEnum.options),
      createdAt: randomPastDate(3),
      updatedAt: new Date(),
    }));
  if (paymentRows.length) await db.insert(payment).values(paymentRows);
  console.log(`seed-finance: inserted ${paymentRows.length} payments`);

  const payouts = tournaments.flatMap(t => {
    if (!faker.datatype.boolean()) return [];
    const winners = userParticipants.filter(p => p.tournamentId === t.id).slice(0, 3);
    return winners.map((w, idx) => ({
      id: faker.string.uuid(),
      tournamentId: t.id,
      participantId: w.id,
      organizerId: t.organizerId,
      type: idx === 0 ? 'WINNER_PRIZE' : 'PLACEMENT_PRIZE',
      amountCents: faker.number.int({ min: 1000, max: 10000 }),
      status: pick(PayoutStatusEnum.options),
      createdAt: randomPastDate(2),
      updatedAt: new Date(),
    }));
  });
  if (payouts.length) await db.insert(payout).values(payouts);
  console.log(`seed-finance: inserted ${payouts.length} payouts`);

  return { payments: paymentRows, payouts };
}
