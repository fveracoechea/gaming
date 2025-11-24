import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

let stage = 'local';
if (process.env.STAGE) stage = process.env.STAGE;

dotenv.config({
  path: '../../infra/.env.' + stage,
});

export default defineConfig({
  schema: './src/schema',
  out: './src/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    ssl: process.env.DATABASE_SSL === 'true',
    url: process.env.DATABASE_URL || '',
  },
});
