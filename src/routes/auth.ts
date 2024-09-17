import { registerUser, loginUser } from '../services/authService';
import { Elysia } from 'elysia';

interface AuthBody {
  email: string;
  password: string;
}

export const authRoutes = (app: Elysia) => {
  app.post('/register', async ({ body }) => {
    const { email, password } = body as AuthBody;

    // Manual validation
    if (typeof email !== 'string' || typeof password !== 'string') {
      return { error: 'Invalid request body' };
    }

    try {
      const token = await registerUser(email, password);
      return { token };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  });

  app.post('/login', async ({ body }) => {
    const { email, password } = body as AuthBody;

    // Manual validation
    if (typeof email !== 'string' || typeof password !== 'string') {
      return { error: 'Invalid request body' };
    }

    try {
      const token = await loginUser(email, password);
      return { token };
    } catch (error) {
      return { error: 'Login failed' };
    }
  });
};
