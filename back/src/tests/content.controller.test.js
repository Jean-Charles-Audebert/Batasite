/**
 * Tests pour le content controller
 * US-1.5.1: Content Retrieval API
 * US-1.5.2: Content Update API
 * US-1.5.3: Content PATCH API
 * US-1.5.4: Content History API
 */

const request = require('supertest');
const app = require('../server');
const { query } = require('../config/db');
const { generateAccessToken } = require('../utils/auth');

describe('Content Management API', () => {
  let authToken;
  let adminId;

  beforeAll(async () => {
    // Clean up all content from previous test runs to avoid FK violations
    try {
      await query('TRUNCATE TABLE content RESTART IDENTITY CASCADE');
    } catch (err) {
      // If TRUNCATE fails, try DELETE
      await query('DELETE FROM content');
    }
    
    // Créer un admin de test unique
    const uniqueEmail = `content-test-${Date.now()}@example.com`;
    const res = await query(
      'INSERT INTO admins (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [uniqueEmail, 'dummyhash', 'admin']
    );
    adminId = res.rows[0].id;

    // Générer un token
    authToken = generateAccessToken({
      id: adminId,
      email: uniqueEmail,
      role: 'admin',
    });
  });

  afterAll(async () => {
    // Cleanup - must delete content before admin due to FK constraint
    await query('DELETE FROM content WHERE updated_by = $1', [adminId]);
    await query('DELETE FROM admins WHERE id = $1', [adminId]);
  });

  describe('GET /content - Retrieval', () => {
    test('should return 200 and content object', async () => {
      // Pré-condition: créer du contenu
      await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2)',
        ['{"page": "home", "title": "Test"}', adminId]
      );

      const response = await request(app)
        .get('/content')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('updated_at');
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get('/content');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 401 with invalid JWT', async () => {
      const response = await request(app)
        .get('/content')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    test('should initialize empty content if none exists', async () => {
      // Delete all content
      await query('DELETE FROM content');

      const response = await request(app)
        .get('/content')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual({});
    });

    test('should return JSONB content correctly', async () => {
      // Cleanup et insert du contenu structuré
      await query('DELETE FROM content');
      const testData = {
        hero: { title: 'Welcome', video: 'video.mp4' },
        sections: [{ name: 'about', content: 'text' }],
      };

      await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2)',
        [JSON.stringify(testData), adminId]
      );

      const response = await request(app)
        .get('/content')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual(testData);
    });
  });

  describe('PUT /content - Full Update', () => {
    test('should update content and return 200', async () => {
      const newData = { hero: { title: 'Updated' }, footer: 'Copyright 2025' };

      const response = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: newData });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content');
      expect(response.body.content).toEqual(newData);
    });

    test('should set updated_by to authenticated admin', async () => {
      const newData = { test: true };

      const response = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: newData });

      expect(response.status).toBe(200);
      expect(response.body.updated_by).toBe(adminId);
    });

    test('should update updated_at timestamp', async () => {
      // Get initial content
      const response1 = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: { version: 1 } });

      expect(response1.status).toBe(200);
      const firstUpdate = new Date(response1.body.updated_at).getTime();

      // Wait a tiny bit and update again
      await new Promise(resolve => setTimeout(resolve, 10));

      const response2 = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: { version: 2 } });

      expect(response2.status).toBe(200);
      const secondUpdate = new Date(response2.body.updated_at).getTime();

      // Second update should be >= first update
      expect(secondUpdate).toBeGreaterThanOrEqual(firstUpdate);
    });

    test('should validate content data (must be object)', async () => {
      const response = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: 'not an object' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject without JWT', async () => {
      const response = await request(app)
        .put('/content')
        .send({ data: {} });

      expect(response.status).toBe(401);
    });

    test('should accept empty object', async () => {
      const response = await request(app)
        .put('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: {} });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual({});
    });
  });

  describe('PATCH /content - Partial Update', () => {
    test('should merge partial data with existing content', async () => {
      // Cleanup et setup
      await query('DELETE FROM content');
      const initialData = { hero: { title: 'Home' }, footer: 'Original' };
      await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2)',
        [JSON.stringify(initialData), adminId]
      );

      // PATCH with partial data
      const partialData = { footer: 'Updated Footer' };
      const response = await request(app)
        .patch('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: partialData });

      expect(response.status).toBe(200);
      expect(response.body.content.hero.title).toBe('Home'); // Kept original
      expect(response.body.content.footer).toBe('Updated Footer'); // Updated
    });

    test('should not overwrite missing fields', async () => {
      const initialData = { a: 1, b: 2, c: 3 };
      await query('DELETE FROM content');
      await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2)',
        [JSON.stringify(initialData), adminId]
      );

      const partialData = { b: 20 };
      const response = await request(app)
        .patch('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: partialData });

      expect(response.status).toBe(200);
      expect(response.body.content).toEqual({ a: 1, b: 20, c: 3 });
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app)
        .patch('/content')
        .send({ data: {} });

      expect(response.status).toBe(401);
    });

    test('should validate data schema', async () => {
      const response = await request(app)
        .patch('/content')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: 'not an object' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /content/history - Content History', () => {
    test('should return array of content versions', async () => {
      const response = await request(app)
        .get('/content/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should include id, content, updated_at, email', async () => {
      // Cleanup et create content
      await query('DELETE FROM content');
      const testData = { version: 1 };
      await query(
        'INSERT INTO content (content, updated_by) VALUES ($1, $2)',
        [JSON.stringify(testData), adminId]
      );

      const response = await request(app)
        .get('/content/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('content');
      expect(item).toHaveProperty('updated_at');
      expect(item).toHaveProperty('email');
    });

    test('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/content/history?limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    test('should default to 20 items if no limit', async () => {
      const response = await request(app)
        .get('/content/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      // Default limit is 20
      expect(response.body.length).toBeLessThanOrEqual(20);
    });

    test('should be ordered by updated_at DESC', async () => {
      const response = await request(app)
        .get('/content/history')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      if (response.body.length > 1) {
        const first = new Date(response.body[0].updated_at);
        const second = new Date(response.body[1].updated_at);
        expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
      }
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get('/content/history');

      expect(response.status).toBe(401);
    });
  });
});
