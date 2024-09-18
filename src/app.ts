import { Elysia } from 'elysia';
import { authRoutes } from './routes/auth';

const app = new Elysia();

// Register the routes
authRoutes(app);

// Start the server (conditionally for testing)
if (require.main === module) {
  app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
  });
}

// Export the app for testing purposes
export { app };
