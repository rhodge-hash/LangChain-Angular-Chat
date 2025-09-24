import { authService } from '../../src/services/auth.service.js';
import { User } from '../../src/models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock User model and bcrypt/jsonwebtoken
jest.mock('../../src/models/user.model.js', () => ({
  User: {
    users: [], // Simulate in-memory store
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn((email, password) => {
      const newUser = { id: User.users.length + 1, email, password, roles: ['user'] };
      User.users.push(newUser);
      return newUser;
    }),
    clearAll: jest.fn(() => { User.users = []; }),
  },
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hashedPassword) => Promise.resolve(password === hashedPassword.replace('hashed_', ''))),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mocked_jwt_token'),
  verify: jest.fn((token) => {
    if (token === 'valid_refresh_token') {
      return { id: 1, email: 'refresh@example.com', roles: ['user'] };
    }
    throw new Error('Invalid token');
  }),
}));

describe('AuthService', () => {
  beforeEach(() => {
    User.clearAll(); // Clear users before each test
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_ACCESS_TOKEN_EXPIRATION = '1h';
    process.env.JWT_REFRESH_TOKEN_EXPIRATION = '7d';
  });

  describe('registerUser', () => {
    it('should register a new user and return the user object', async () => {
      User.findByEmail.mockReturnValueOnce(undefined); // User does not exist
      const user = await authService.registerUser('test@example.com', 'password123');
      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith('test@example.com', 'hashed_password123');
      expect(user).toHaveProperty('email', 'test@example.com');
    });

    it('should throw an error if user already exists', async () => {
      User.findByEmail.mockReturnValueOnce({ email: 'test@example.com' }); // User exists
      await expect(authService.registerUser('test@example.com', 'password123')).rejects.toThrow('User already exists');
      expect(User.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return access and refresh tokens', async () => {
      const mockUser = { id: 1, email: 'login@example.com', password: 'hashed_password123', roles: ['user'] };
      User.findByEmail.mockReturnValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true); // Passwords match

      const { accessToken, refreshToken } = await authService.loginUser('login@example.com', 'password123');

      expect(User.findByEmail).toHaveBeenCalledWith('login@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password123');
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(accessToken).toBe('mocked_jwt_token');
      expect(refreshToken).toBe('mocked_jwt_token');
    });

    it('should throw an error for invalid credentials (user not found)', async () => {
      User.findByEmail.mockReturnValueOnce(undefined); // User not found
      await expect(authService.loginUser('nonexistent@example.com', 'password123')).rejects.toThrow('Invalid credentials');
      expect(User.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw an error for invalid credentials (password mismatch)', async () => {
      const mockUser = { id: 1, email: 'login@example.com', password: 'hashed_wrongpassword', roles: ['user'] };
      User.findByEmail.mockReturnValueOnce(mockUser);
      bcrypt.compare.mockResolvedValueOnce(false); // Passwords do not match

      await expect(authService.loginUser('login@example.com', 'password123')).rejects.toThrow('Invalid credentials');
      expect(User.findByEmail).toHaveBeenCalledWith('login@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_wrongpassword');
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return a new access token for a valid refresh token', async () => {
      const newAccessToken = await authService.refreshAccessToken('valid_refresh_token');
      expect(jwt.verify).toHaveBeenCalledWith('valid_refresh_token', 'test_secret');
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(newAccessToken).toBe('mocked_jwt_token');
    });

    it('should throw an error for an invalid refresh token', async () => {
      await expect(authService.refreshAccessToken('invalid_refresh_token')).rejects.toThrow('Invalid or expired refresh token');
      expect(jwt.verify).toHaveBeenCalledWith('invalid_refresh_token', 'test_secret');
      expect(User.findById).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});