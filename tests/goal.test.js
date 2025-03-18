const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Goal = require('../src/models/goalModel');
const jwt = require('jsonwebtoken');

describe('Goal Routes', () => {
  let token;
  let userId;
  let goalId;

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

    // Create test goal
    const goal = new Goal({
      user: userId,
      name: 'Test Goal',
      targetAmount: 1000,
      deadline: new Date('2025-12-31')
    });
    await goal.save();
    goalId = goal._id;
  });

  describe('POST /api/goals', () => {
    it('should create a new goal', async () => {
      const goalData = {
        name: 'New Goal',
        targetAmount: 500,
        deadline: new Date('2025-06-30').toISOString()
      };

      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${token}`)
        .send(goalData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'New Goal');
      expect(res.body).toHaveProperty('targetAmount', 500);
    });
  });

  describe('GET /api/goals', () => {
    it('should get all goals for a user', async () => {
      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Test Goal');
    });
  });

  describe('PUT /api/goals/:id', () => {
    it('should update a goal', async () => {
      const updateData = {
        name: 'Updated Goal',
        targetAmount: 1500
      };

      const res = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Goal updated successfully');
      expect(res.body.goal).toHaveProperty('name', 'Updated Goal');
      expect(res.body.goal).toHaveProperty('targetAmount', 1500);
    });
  });

  describe('POST /api/goals/:id/allocate', () => {
    it('should allocate savings to a goal', async () => {
      const allocationData = {
        amount: 500
      };

      const res = await request(app)
        .post(`/api/goals/${goalId}/allocate`)
        .set('Authorization', `Bearer ${token}`)
        .send(allocationData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Savings allocated successfully');
      expect(res.body.goal).toHaveProperty('savedAmount', 500);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('should delete a goal', async () => {
      const res = await request(app)
        .delete(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Goal deleted successfully');

      // Verify goal is deleted
      const goal = await Goal.findById(goalId);
      expect(goal).toBeNull();
    });
  });
});