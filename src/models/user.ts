import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { db } from '../db';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

export type User = typeof users.$inferInsert;
