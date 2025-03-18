const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Transaction = require('../src/models/transactionModel');
const Category = require('../src/models/categoryModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

describe('Report Routes', () => {
  let token;
  let userId;
  let categoryId;

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

    // Create test category
    const category = new Category({
      user: userId,
      name: 'Test Category',
      type: 'expense'
    });
    await category.save();
    categoryId = category._id;

    // Create test transactions
    const currentMonth = new Date();
    await Transaction.create([
      {
        user: userId,
        type: 'expense',
        amount: 100,
        category: categoryId,
        description: 'Test Transaction 1',
        date: currentMonth
      },
      {
        user: userId,
        type: 'expense',
        amount: 200,
        category: categoryId,
        description: 'Test Transaction 2',
        date: currentMonth
      }
    ]);
  });

  describe('GET /api/reports/monthly-spending', () => {
    it('should get monthly spending report', async () => {
      const res = await request(app)
        .get('/api/reports/monthly-spending')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      // There should be at least one entry in the report
      expect(res.body.length).toBeGreaterThan(0);
      
      // Check the structure of the report
      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('category');
        expect(res.body[0]).toHaveProperty('totalSpent');
      }
    });
  });
});