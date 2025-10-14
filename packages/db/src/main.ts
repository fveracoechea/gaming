import { drizzle } from "drizzle-orm/node-postgres";

export * as schema from "./schema/_index";
import * as schema from "./schema/_index";

export const db = drizzle({
  schema,
  casing: "snake_case",
  connection: {
    connectionString: process.env.DATABASE_URL,
    // ssl: true,
  },
});
