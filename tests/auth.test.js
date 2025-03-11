const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('name', userData.name);
      
      // Check if user was created in the database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
    });

    it('should not register a user with missing fields', async () => {
      const userData = {
        name: 'Test User',
        // Email is missing
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('should not register a user with existing email', async () => {
      // Create a user first
      const existingUser = new User({
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'hashedpassword'
      });
      await existingUser.save();

      // Try to register with same email
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('msg', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each test
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });
  });
});