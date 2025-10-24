import * as t from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: t.timestamp({ withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true, mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/**
 * Shared primary key column (text UUID)
 */
export const id = t.uuid().notNull().primaryKey().defaultRandom();
