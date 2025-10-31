import { drizzle } from 'drizzle-orm/node-postgres';

// DrizzleDB type used by seed modules. Index script passes the instance created via drizzle().
export type DrizzleDB = ReturnType<typeof drizzle>;
