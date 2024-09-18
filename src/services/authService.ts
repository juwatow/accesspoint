import { db } from '../db';
import { users, User } from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { email, password: hashedPassword };
  await db.insert(users).values(newUser);
  return generateToken(newUser);
};

export const loginUser = async (email: string, password: string) => {
  // Correct Drizzle ORM query to find the user by email using the eq() function
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then(rows => rows[0]);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  return generateToken(user);
};

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};
