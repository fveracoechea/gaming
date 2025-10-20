// Payout status for distributing winnings
export const PayoutStatusEnum = z.enum([
  'PENDING', // scheduled to be processed
  'PROCESSING', // in progress with provider
  'COMPLETED', // funds delivered
  'FAILED', // failed attempt
  'CANCELED', // canceled before completion
]);

export type PayoutStatus = z.infer<typeof PayoutStatusEnum>;
