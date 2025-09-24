import request from 'supertest';
import app from '../../src/app.js'; // Assuming your Express app is exported from app.js

describe('Auth API Contract Tests', () => {
  // Test /api/auth/register endpoint
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          password: 'password123'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email and password are required');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email and password are required');
    });

    it('should return 400 if user already exists', async () => {
      // Register once
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      // Try to register again with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'User already exists');
    });
  });

  // Test /api/auth/login endpoint
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Ensure a user exists for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
    });

    it('should log in a user and return a JWT', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Email and password are required');
    });
  });

  // Test /api/auth/refresh-token endpoint
  describe('POST /api/auth/refresh-token', () => {
    let refreshToken = '';

    beforeEach(async () => {
      // Register and login to get a refresh token
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'refresh@example.com',
          password: 'password123'
        });
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'refresh@example.com',
          password: 'password123'
        });
      refreshToken = loginRes.body.refreshToken;
    });

    it('should refresh the token successfully', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: refreshToken
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({
          refreshToken: 'invalid-refresh-token'
        });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Invalid or expired refresh token');
    });

    it('should return 400 if refresh token is missing', async () => {
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .send({});
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Refresh token is required');
    });
  });
});