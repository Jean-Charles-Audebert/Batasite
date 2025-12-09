const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Admin Management API', () => {
  let authToken;
  let adminId;
  let testAdminId;

  beforeAll(async () => {
    // Register superadmin
    const adminRegRes = await request(app)
      .post('/auth/register')
      .send({
        email: `admin-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'superadmin',
      });

    adminId = adminRegRes.body.data.id;

    // Login to get token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: adminRegRes.body.data.email,
        password: 'TestPassword123!',
      });

    authToken = loginRes.body.accessToken;

    // Create test regular admin
    const testAdminRegRes = await request(app)
      .post('/auth/register')
      .send({
        email: `test-admin-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'admin',
      });

    testAdminId = testAdminRegRes.body.data.id;
  });

  afterAll(async () => {
    // Let auth.controller.test handle pool cleanup
  });

  describe('GET /admin - List all admins', () => {
    test('should return array of admins (200)', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    test('should return id, email, role, is_active (no password)', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      const admin = response.body[0];
      expect(admin).toHaveProperty('id');
      expect(admin).toHaveProperty('email');
      expect(admin).toHaveProperty('role');
      expect(admin).toHaveProperty('is_active');
      expect(admin).not.toHaveProperty('password_hash');
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get('/admin');

      expect(response.status).toBe(401);
    });

    test('should return 401 with invalid JWT', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
    });

    test('should filter by role if query param provided', async () => {
      const response = await request(app)
        .get('/admin?role=admin')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Just check that filter endpoint works, doesn't error
    });
  });

  describe('GET /admin/:id - Fetch single admin', () => {
    test('should return admin by ID (200)', async () => {
      // Debug: check if testAdminId exists
      if (!testAdminId) {
        console.error('[DEBUG] testAdminId is', testAdminId);
      }
      const response = await request(app)
        .get(`/admin/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testAdminId);
    });

    test('should return id, email, role, is_active (no password)', async () => {
      const response = await request(app)
        .get(`/admin/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
      expect(response.body).toHaveProperty('is_active');
      expect(response.body).not.toHaveProperty('password_hash');
    });

    test('should return 404 for non-existent admin', async () => {
      const response = await request(app)
        .get('/admin/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test('should return 400 for invalid admin ID format', async () => {
      const response = await request(app)
        .get('/admin/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get(`/admin/${testAdminId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /admin/:id/activity - Fetch admin activity', () => {
    test('should return activity log for admin', async () => {
      // Perform an action first
      await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .get(`/admin/${adminId}/activity`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get(`/admin/${adminId}/activity`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent admin', async () => {
      const response = await request(app)
        .get('/admin/99999/activity')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /admin - Create admin', () => {
    test('should create admin with email, password, role (201)', async () => {
      const response = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: `new-admin-${Date.now()}@example.com`,
          password: 'NewPassword123!',
          role: 'admin',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body.role).toBe('admin');
      expect(response.body).not.toHaveProperty('password_hash');
    });

    test('should create admin as superadmin', async () => {
      const response = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: `super-${Date.now()}@example.com`,
          password: 'SuperPassword123!',
          role: 'superadmin',
        });

      expect(response.status).toBe(201);
      expect(response.body.role).toBe('superadmin');
    });

    test('should return 400 if missing email', async () => {
      const response = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          password: 'Password123!',
          role: 'admin',
        });

      expect(response.status).toBe(400);
    });

    test('should return 400 if missing password', async () => {
      const response = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: `admin-${Date.now()}@example.com`,
          role: 'admin',
        });

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app)
        .post('/admin')
        .send({
          email: `admin-${Date.now()}@example.com`,
          password: 'Password123!',
          role: 'admin',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /admin/:id - Update admin', () => {
    test('should update admin role (200)', async () => {
      const response = await request(app)
        .patch(`/admin/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          role: 'superadmin',
        });

      expect(response.status).toBe(200);
      expect(response.body.role).toBe('superadmin');
    });

    test('should update admin password', async () => {
      const response = await request(app)
        .patch(`/admin/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          password: 'NewPassword456!',
        });

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('password_hash');
    });

    test('should return 400 if invalid ID', async () => {
      const response = await request(app)
        .patch('/admin/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          role: 'admin',
        });

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app)
        .patch(`/admin/${testAdminId}`)
        .send({
          role: 'admin',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /admin/:id - Delete admin', () => {
    test('should delete admin (200)', async () => {
      // Create an admin to delete
      const createRes = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: `delete-me-${Date.now()}@example.com`,
          password: 'Password123!',
          role: 'admin',
        });

      const deleteRes = await request(app)
        .delete(`/admin/${createRes.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toHaveProperty('message');
    });

    test('should return 400 if invalid ID', async () => {
      const response = await request(app)
        .delete('/admin/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).delete(`/admin/${testAdminId}`);

      expect(response.status).toBe(401);
    });

    test('should return 404 for non-existent admin', async () => {
      const response = await request(app)
        .delete('/admin/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
