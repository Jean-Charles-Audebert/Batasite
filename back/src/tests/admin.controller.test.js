const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

describe('Admin Management API', () => {
  let authToken;
  let testAdminId;
  let superadminId; // ID of the seed superadmin (immuable)

  beforeAll(async () => {
    // Create test regular admin for CRUD operations
    const testAdminRegRes = await request(app)
      .post('/auth/register')
      .send({
        email: `test-admin-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      });

    testAdminId = testAdminRegRes.body.data.id;

    // Login as test admin to get token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testAdminRegRes.body.data.email,
        password: 'TestPassword123!',
      });

    authToken = loginRes.body.accessToken;

    // Get the seed superadmin ID (first superadmin in DB)
    const superadminQuery = await pool.query(
      'SELECT id FROM admins WHERE role = \'superadmin\' ORDER BY id ASC LIMIT 1'
    );
    superadminId = superadminQuery.rows[0]?.id;
  });

  afterAll(async () => {
    // Clean up test admins created during tests (not the seed superadmin)
    try {
      if (testAdminId) {
        await pool.query('DELETE FROM admins WHERE id = $1', [testAdminId]);
      }
    } catch (err) {
      console.error('Cleanup error:', err);
    }
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

    test('should exclude superadmins from list', async () => {
      const response = await request(app)
        .get('/admin')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      // Check that all returned admins have role 'admin', not 'superadmin'
      response.body.forEach(admin => {
        expect(admin.role).toBe('admin');
      });
      // Ensure superadmin is NOT in the list
      if (superadminId) {
        const superadminInList = response.body.some(admin => admin.id === superadminId);
        expect(superadminInList).toBe(false);
      }
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
        .get(`/admin/${testAdminId}/activity`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).get(`/admin/${testAdminId}/activity`);

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

    test('should accept admin creation without password (invitation flow)', async () => {
      const response = await request(app)
        .post('/admin')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: `admin-${Date.now()}@example.com`,
          role: 'admin',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBeDefined();
      expect(response.body.role).toBe('admin');
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
    let anotherAdminId;

    beforeAll(async () => {
      // Create another admin for modification testing
      const anotherAdminRegRes = await request(app)
        .post('/auth/register')
        .send({
          email: `another-admin-${Date.now()}@example.com`,
          password: 'TestPassword123!',
        });
      anotherAdminId = anotherAdminRegRes.body.data.id;
    });

    afterAll(async () => {
      // Clean up
      if (anotherAdminId) {
        try {
          await pool.query('DELETE FROM admins WHERE id = $1', [anotherAdminId]);
        } catch (err) {
          console.error('Cleanup error in PATCH tests:', err);
        }
      }
    });

    test('should update admin role (200)', async () => {
      const response = await request(app)
        .patch(`/admin/${anotherAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          role: 'admin',
        });

      expect(response.status).toBe(200);
      expect(response.body.role).toBe('admin');
    });

    test('should update admin password', async () => {
      const response = await request(app)
        .patch(`/admin/${anotherAdminId}`)
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
