import { Elysia } from 'elysia';
import { authRoutes } from './routes/auth';
import * as dotenv from 'dotenv';
dotenv.config();

const app = new Elysia();

authRoutes(app);

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});
