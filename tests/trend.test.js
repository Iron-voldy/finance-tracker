const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Transaction = require('../src/models/transactionModel');
const Category = require('../src/models/categoryModel');
const jwt = require('jsonwebtoken');

describe('Trend Routes', () => {
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
    
    // Create test income category
    const incomeCategory = new Category({
      user: userId,
      name: 'Salary',
      type: 'income'
    });
    await incomeCategory.save();
    incomeCategoryId = incomeCategory._id;

    // Create test transactions for the past months
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 15);
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 15);
    
    await Transaction.create([
      {
        user: userId,
        type: 'expense',
        amount: 100,
        category: categoryId,
        description: 'Test Expense 1',
        date: currentDate
      },
      {
        user: userId,
        type: 'expense',
        amount: 80,
        category: categoryId,
        description: 'Test Expense 2',
        date: lastMonth
      },
      {
        user: userId,
        type: 'income',
        amount: 1000,
        category: incomeCategoryId,
        description: 'Test Income 1',
        date: currentDate
      },
      {
        user: userId,
        type: 'income',
        amount: 1000,
        category: incomeCategoryId,
        description: 'Test Income 2',
        date: twoMonthsAgo
      }
    ]);
  });

  describe('GET /api/trends/expenses', () => {
    it('should get expense trends', async () => {
      const res = await request(app)
        .get('/api/trends/expenses')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('GET /api/trends/income', () => {
    it('should get income trends', async () => {
      const res = await request(app)
        .get('/api/trends/income')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('GET /api/trends/unusual-spending', () => {
    it('should get unusual spending data', async () => {
      const res = await request(app)
        .get('/api/trends/unusual-spending')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });
});