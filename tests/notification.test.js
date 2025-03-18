const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Notification = require('../src/models/notificationModel');
const jwt = require('jsonwebtoken');

describe('Notification Routes', () => {
  let token;
  let userId;
  let notificationId;

  beforeEach(async () => {
    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();
    userId = user._id;

    // Create token
    token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET);

    // Create test notification
    const notification = new Notification({
      user: userId,
      message: 'Test notification',
      type: 'transaction'
    });
    await notification.save();
    notificationId = notification._id;
  });

  describe('GET /api/notifications', () => {
    it('should get all notifications for a user', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].message).toBe('Test notification');
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark a notification as read', async () => {
      const res = await request(app)
        .put(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Notification marked as read');

      // Verify notification is marked as read
      const notification = await Notification.findById(notificationId);
      expect(notification.read).toBeTruthy();
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      const res = await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Notification deleted successfully');

      // Verify notification is deleted
      const notification = await Notification.findById(notificationId);
      expect(notification).toBeNull();
    });
  });
});