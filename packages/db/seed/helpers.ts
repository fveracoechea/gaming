import { faker } from '@faker-js/faker';

export const pick = <T>(arr: readonly T[]): T => {
  if (arr.length === 0) throw new Error('pick() called with empty array');
  return arr[Math.floor(Math.random() * arr.length)]!;
};
export const times = <T>(n: number, fn: (i: number) => T): T[] =>
  Array.from({ length: n }, (_, i) => fn(i));

export const regions = ['NA', 'EU', 'SEA', 'SA', 'CN'] as const;

export const randomPastDate = (daysBack = 30) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d;
};

export const randomFutureDate = (daysForward = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * daysForward));
  return d;
};

export { faker };
