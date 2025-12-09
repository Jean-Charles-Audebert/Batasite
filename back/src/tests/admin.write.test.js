const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/db');

describe('Admin Management API - Write Operations', () => {
  let authToken;
  let superadminId;
  let testAdminId;
  let targetAdminId;

  beforeAll(async () => {
    // Fetch the seed superadmin for authentication
    const superadminQuery = await pool.query(
      'SELECT id FROM admins WHERE role = \'superadmin\' ORDER BY id ASC LIMIT 1'
    );
    superadminId = superadminQuery.rows[0]?.id;

    // For write operations tests, we'll use the seed superadmin for auth
    // Since we can't create superadmins via register anymore, we need to manually authenticate
    // or use the first created admin as the auth user
    
    // Create test admin to use for API calls (will be treated as admin auth user)
    const testAdminRegRes = await request(app)
      .post('/auth/register')
      .send({
        email: `admin-write-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      });

    testAdminId = testAdminRegRes.body.data.id;

    // Login to get token
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: testAdminRegRes.body.data.email,
        password: 'TestPassword123!',
      });

    authToken = loginRes.body.accessToken;

    // Create target admin for modification/deletion
    const targetAdminRegRes = await request(app)
      .post('/auth/register')
      .send({
        email: `target-admin-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      });

    targetAdminId = targetAdminRegRes.body.data.id;
  });

  afterAll(async () => {
    // Clean up test admins created during tests
    try {
      if (testAdminId) {
        await pool.query('DELETE FROM admins WHERE id = $1', [testAdminId]);
      }
      if (targetAdminId) {
        await pool.query('DELETE FROM admins WHERE id = $1', [targetAdminId]);
      }
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  });

  describe('PATCH /admin/:id - Update admin', () => {
    test('should update admin and return 200', async () => {
      const response = await request(app)
        .patch(`/admin/${targetAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ is_active: false });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(targetAdminId);
      expect(response.body.is_active).toBe(false);
    });

    test('should update admin role', async () => {
      const response = await request(app)
        .patch(`/admin/${targetAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ role: 'admin' });

      expect(response.status).toBe(200);
      expect(response.body.role).toBe('admin');
    });

    test('should not allow updating email', async () => {
      const response = await request(app)
        .patch(`/admin/${targetAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: 'newemail@example.com' });

      expect(response.status).toBe(400);
    });

    test('should allow updating password via PATCH', async () => {
      const response = await request(app)
        .patch(`/admin/${targetAdminId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'NewPassword123!' });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(targetAdminId);
    });

    test('should return 404 for non-existent admin', async () => {
      const response = await request(app)
        .patch('/admin/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ is_active: false });

      expect(response.status).toBe(404);
    });

    test('should return 400 for invalid admin ID format', async () => {
      const response = await request(app)
        .patch('/admin/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ is_active: false });

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app)
        .patch(`/admin/${targetAdminId}`)
        .send({ is_active: false });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /admin/:id - Delete admin', () => {
    test('should delete admin and return 200', async () => {
      // First create an admin specifically for deletion
      const tempAdminRes = await request(app)
        .post('/auth/register')
        .send({
          email: `temp-admin-${Date.now()}@example.com`,
          password: 'TestPassword123!',
          role: 'admin',
        });

      const tempAdminId = tempAdminRes.body.data.id;

      const response = await request(app)
        .delete(`/admin/${tempAdminId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
    });

    test('should not allow deleting self', async () => {
      const response = await request(app)
        .delete(`/admin/${testAdminId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Cannot');
    });

    test('should return 404 for non-existent admin', async () => {
      const response = await request(app)
        .delete('/admin/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    test('should return 400 for invalid admin ID format', async () => {
      const response = await request(app)
        .delete('/admin/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });

    test('should return 401 without JWT', async () => {
      const response = await request(app).delete(`/admin/${targetAdminId}`);

      expect(response.status).toBe(401);
    });
  });
});
