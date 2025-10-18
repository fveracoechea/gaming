import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: t
    .timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true, mode: "date" })
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date()),
};

/**
 * Shared primary key column (text UUID)
 */
export const id = t
  .text()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());
