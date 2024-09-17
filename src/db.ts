import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config();

const connection = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
export const db = drizzle(connection);
