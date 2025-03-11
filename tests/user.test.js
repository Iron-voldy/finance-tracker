const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('User Routes', () => {
  let token;
  let userId;

  beforeEach(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    await user.save();
    userId = user._id;

    // Create token
    token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET);
  });

  describe('GET /api/users/me', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', 'test@example.com');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/api/users/me');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
    });
  });

  describe('PUT /api/users/update', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'Test bio'
      };

      const res = await request(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Profile updated successfully');
      expect(res.body.user).toHaveProperty('name', 'Updated Name');
      expect(res.body.user).toHaveProperty('bio', 'Test bio');

      // Check if the user was updated in the database
      const updatedUser = await User.findById(userId);
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.bio).toBe('Test bio');
    });

    it('should update user password', async () => {
      const updateData = {
        password: 'newpassword123'
      };

      const res = await request(app)
        .put('/api/users/update')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Profile updated successfully');

      // Check if password was updated in the database
      const updatedUser = await User.findById(userId);
      const isPasswordMatch = await bcrypt.compare('newpassword123', updatedUser.password);
      expect(isPasswordMatch).toBeTruthy();
    });
  });

  describe('DELETE /api/users/delete', () => {
    it('should delete user account', async () => {
      const res = await request(app)
        .delete('/api/users/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'User account deleted successfully');

      // Verify user is deleted from database
      const user = await User.findById(userId);
      expect(user).toBeNull();
    });
  });
});