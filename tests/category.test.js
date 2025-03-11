const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/userModel');
const Category = require('../src/models/categoryModel');
const jwt = require('jsonwebtoken');

describe('Category Routes', () => {
  let token;
  let userId;

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
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        type: 'expense'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Category');
      expect(res.body).toHaveProperty('type', 'expense');
    });

    it('should not create a category with duplicate name', async () => {
      // Create category first
      await Category.create({
        user: userId,
        name: 'Test Category',
        type: 'expense'
      });

      // Try to create with same name
      const categoryData = {
        name: 'Test Category',
        type: 'expense'
      };

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send(categoryData);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('msg', 'Category already exists');
    });
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      // Create test categories
      await Category.create([
        {
          user: userId,
          name: 'Category 1',
          type: 'expense'
        },
        {
          user: userId,
          name: 'Category 2',
          type: 'income'
        }
      ]);
    });

    it('should get all categories for a user', async () => {
      const res = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      // Create a test category
      const category = new Category({
        user: userId,
        name: 'Test Category',
        type: 'expense'
      });
      await category.save();
      categoryId = category._id;
    });

    it('should update a category', async () => {
      const updateData = {
        name: 'Updated Category'
      };

      const res = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Category updated successfully');
      expect(res.body.category).toHaveProperty('name', 'Updated Category');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    let categoryId;

    beforeEach(async () => {
      // Create a test category
      const category = new Category({
        user: userId,
        name: 'Test Category',
        type: 'expense'
      });
      await category.save();
      categoryId = category._id;
    });

    it('should delete a category', async () => {
      const res = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Category deleted successfully');

      // Verify category is deleted
      const category = await Category.findById(categoryId);
      expect(category).toBeNull();
    });
  });
});