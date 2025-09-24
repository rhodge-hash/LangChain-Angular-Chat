import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1h';
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d';

const saltRounds = 10;

export const authService = {
  async registerUser(email, password) {
    if (User.findByEmail(email)) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = User.create(email, hashedPassword);
    return user;
  },

  async loginUser(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION });
    const refreshToken = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRATION });

    return { accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }
      const newAccessToken = jwt.sign({ id: user.id, email: user.email, roles: user.roles }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRATION });
      return newAccessToken;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
};