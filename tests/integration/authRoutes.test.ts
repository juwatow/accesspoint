import { app } from '../../src/app';
import request from 'supertest';
import { db } from '../../src/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../src/db'); // Mock the DB calls
jest.mock('bcryptjs'); // Mock bcrypt
jest.mock('jsonwebtoken'); // Mock JWT

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and return a token', async () => {
    // Arrange
    const hashedPassword = 'hashedpassword123';
    const token = 'testtoken';

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    // Act & Assert
    const res = await request(app)
      .post('/register')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe(token);
  });

  it('should return an error for invalid login', async () => {
    // Arrange
    (db.select as jest.Mock).mockResolvedValueOnce([]);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    // Act & Assert
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should return a token for valid login', async () => {
    // Arrange
    const user = { email: 'test@example.com', password: 'hashedpassword' };
    const token = 'testtoken';

    (db.select as jest.Mock).mockResolvedValueOnce([user]);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    // Act & Assert
    const res = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe(token);
  });
});
