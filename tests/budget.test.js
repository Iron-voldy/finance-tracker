const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Category = require('../src/models/categoryModel');
const Budget = require('../src/models/budgetModel');
const jwt = require('jsonwebtoken');

describe('Budget Routes', () => {
  let token;
  let userId;
  let categoryId;

  beforeEach(async () => {
    // Create a test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();
    userId = user._id;

    // Create token
    token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET);

    // Create a test category
    const category = new Category({
      user: userId,
      name: 'Test Category',
      type: 'expense'
    });
    await category.save();
    categoryId = category._id;
  });

  describe('POST /api/budgets', () => {
    it('should create a new budget', async () => {
      const budgetData = {
        categoryId: categoryId,
        amount: 500
      };

      const res = await request(app)
        .post('/api/budgets')
        .set('Authorization', `Bearer ${token}`)
        .send(budgetData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('amount', 500);
      expect(res.body).toHaveProperty('category', categoryId.toString());
    });
  });

  describe('GET /api/budgets', () => {
    beforeEach(async () => {
      // Create test budgets
      await Budget.create({
        user: userId,
        category: categoryId,
        amount: 500
      });
    });

    it('should get all budgets for a user', async () => {
      const res = await request(app)
        .get('/api/budgets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
    });
  });

  describe('DELETE /api/budgets/:id', () => {
    let budgetId;

    beforeEach(async () => {
      // Create a test budget
      const budget = new Budget({
        user: userId,
        category: categoryId,
        amount: 500
      });
      await budget.save();
      budgetId = budget._id;
    });

    it('should delete a budget', async () => {
      const res = await request(app)
        .delete(`/api/budgets/${budgetId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Budget deleted successfully');

      // Verify budget is deleted
      const budget = await Budget.findById(budgetId);
      expect(budget).toBeNull();
    });
  });
});