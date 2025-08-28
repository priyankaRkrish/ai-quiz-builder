import request from 'supertest';
import express from 'express';
import { authRoutes } from '../auth';

// Mock the services
jest.mock('../../services/prismaService');
jest.mock('../../services/loggerService', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          password: 'password123',
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.error).toBe('Email, password, and username are required');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.error).toBe('Email, password, and username are required');
    });

    it('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error).toBe('Email, password, and username are required');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: '123',
          username: 'testuser'
        })
        .expect(400);

      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.error).toBe('Email and password are required');
    });
  });

  describe('Protected Routes', () => {
    it('should require authentication for profile endpoint', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    it('should require authentication for logout endpoint', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });
});
