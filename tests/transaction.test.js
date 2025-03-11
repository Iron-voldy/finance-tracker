const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Category = require('../src/models/categoryModel');
const Transaction = require('../src/models/transactionModel');
const jwt = require('jsonwebtoken');

describe('Transaction Routes', () => {
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

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        type: 'expense',
        amount: 100,
        categoryId: categoryId,
        description: 'Test Transaction'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(transactionData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('amount', 100);
      expect(res.body).toHaveProperty('description', 'Test Transaction');
    });

    it('should not create a transaction with invalid category ID', async () => {
      const transactionData = {
        type: 'expense',
        amount: 100,
        categoryId: '60c72b2f5c5f5e001b16f123', // Invalid ID
        description: 'Test Transaction'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send(transactionData);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('msg', 'Category not found');
    });
  });

  describe('GET /api/transactions', () => {
    beforeEach(async () => {
      // Create test transactions
      await Transaction.create([
        {
          user: userId,
          type: 'expense',
          amount: 100,
          category: categoryId,
          description: 'Test Transaction 1'
        },
        {
          user: userId,
          type: 'expense',
          amount: 200,
          category: categoryId,
          description: 'Test Transaction 2'
        }
      ]);
    });

    it('should get all transactions for a user', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      // Create a test transaction
      const transaction = new Transaction({
        user: userId,
        type: 'expense',
        amount: 100,
        category: categoryId,
        description: 'Test Transaction'
      });
      await transaction.save();
      transactionId = transaction._id;
    });

    it('should get a transaction by ID', async () => {
      const res = await request(app)
        .get(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('_id', transactionId.toString());
      expect(res.body).toHaveProperty('amount', 100);
    });

    it('should return 404 for non-existent transaction', async () => {
      const res = await request(app)
        .get('/api/transactions/60c72b2f5c5f5e001b16f123')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('msg', 'Transaction not found');
    });
  });

  describe('PUT /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      // Create a test transaction
      const transaction = new Transaction({
        user: userId,
        type: 'expense',
        amount: 100,
        category: categoryId,
        description: 'Test Transaction'
      });
      await transaction.save();
      transactionId = transaction._id;
    });

    it('should update a transaction', async () => {
      const updateData = {
        amount: 150,
        description: 'Updated Transaction'
      };

      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Transaction updated successfully');
      expect(res.body.transaction).toHaveProperty('amount', 150);
      expect(res.body.transaction).toHaveProperty('description', 'Updated Transaction');
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    let transactionId;

    beforeEach(async () => {
      // Create a test transaction
      const transaction = new Transaction({
        user: userId,
        type: 'expense',
        amount: 100,
        category: categoryId,
        description: 'Test Transaction'
      });
      await transaction.save();
      transactionId = transaction._id;
    });

    it('should delete a transaction', async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Transaction deleted successfully');

      // Verify transaction is deleted
      const transaction = await Transaction.findById(transactionId);
      expect(transaction).toBeNull();
    });
  });
});