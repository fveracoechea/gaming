import { z } from 'zod';

// Entry payment status values
export const PaymentStatusEnum = z.enum([
  'PENDING', // intent created, awaiting confirmation
  'PROCESSING', // payment processor working
  'SUCCEEDED', // funds captured successfully
  'FAILED', // failed without capture
  'CANCELED', // manually canceled before success
  'REFUNDED', // refunded post success
]);

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
