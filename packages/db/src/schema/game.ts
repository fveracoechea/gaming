import * as t from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";

/**
 * Games supported by the platform (e.g. Dota2, others in future)
 * this is referenced by tournaments to specify which game they are for
 * and can hold game-specific settings in future
 */
export const game = t.pgTable("game", {
  id, // e.g. "dota2" if manually set; defaults to UUID
  name: t.varchar().notNull(),
  slug: t.varchar().notNull().unique(),
  ...timestamps,
});
