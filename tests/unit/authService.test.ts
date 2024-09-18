import { registerUser, loginUser } from '../../src/services/authService';
import { db } from '../../src/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../src/db'); // Mock the DB calls
jest.mock('bcryptjs'); // Mock bcrypt calls
jest.mock('jsonwebtoken'); // Mock JWT calls

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clears mocks after each test
  });

  it('should register a new user and return a token', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashedpassword123';
    const token = 'testtoken';

    // Mock the behavior of bcrypt and jwt
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    // Act
    const result = await registerUser(email, password);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(jwt.sign).toHaveBeenCalledWith({ email }, expect.any(String), { expiresIn: '1h' });
    expect(result).toBe(token);
  });

  it('should throw an error if login fails', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'wrongpassword';

    (db.select as jest.Mock).mockResolvedValueOnce([]);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    // Act & Assert
    await expect(loginUser(email, password)).rejects.toThrow('Invalid email or password');
  });

  it('should return a token if login is successful', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'password123';
    const user = { email, password: 'hashedpassword' };
    const token = 'testtoken';

    (db.select as jest.Mock).mockResolvedValueOnce([user]);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
    (jwt.sign as jest.Mock).mockReturnValue(token);

    // Act
    const result = await loginUser(email, password);

    // Assert
    expect(result).toBe(token);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedpassword');
  });
});
