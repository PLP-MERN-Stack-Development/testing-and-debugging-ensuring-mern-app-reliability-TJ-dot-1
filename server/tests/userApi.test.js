const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('User API', () => {
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe(userData.email);
      
      // Verify user was saved in database
      const user = await User.findById(response.body._id);
      expect(user).toBeTruthy();
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create first user
      await request(app).post('/api/users').send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('Email already exists');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      // Create test users
      await User.create([
        { name: 'User 1', email: 'user1@example.com', password: 'password123' },
        { name: 'User 2', email: 'user2@example.com', password: 'password123' }
      ]);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });
  });
});