/**
 * Tests pour le controller d'authentification
 * Integration tests avec la vraie base de données
 */
const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('Auth Controller', () => {
  // Setup: Nettoyer et créer la BDD
  beforeAll(async () => {
    await db.initDb();
  });

  // Cleanup après les tests
  afterAll(async () => {
    // Clean up all test admins created during tests
    try {
      await db.pool.query('DELETE FROM admins WHERE email LIKE \'%test%\' OR email LIKE \'%example.com\'');
    } catch (e) {
      console.error('Cleanup error:', e);
    }
    await db.closePool();
  });

  // Nettoyer les données entre chaque test
  beforeEach(async () => {
    // Supprimer tous les admins sauf ceux d'origine
    try {
      await db.pool.query('DELETE FROM admins WHERE email LIKE \'%test%\'');
    } catch (e) {
      // Ignore
    }
  });

  describe('POST /auth/login', () => {
    test('should login successfully and return tokens', async () => {
      // D'abord, enregistrer un nouvel admin
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: `login-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      const { email } = registerRes.body.data;

      // Maintenant essayer de se connecter
      const response = await request(app)
        .post('/auth/login')
        .send({
          email,
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(response.body.admin).toBeDefined();
      expect(response.body.admin.password_hash).toBeUndefined();
    });

    test('should reject non-existent email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: `notfound-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('should reject inactive admin', async () => {
      // D'abord créer un admin
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: `inactive-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      const { email, id } = registerRes.body.data;

      // Désactiver l'admin directement en base
      await db.pool.query(
        'UPDATE admins SET is_active = false WHERE id = $1',
        [id]
      );

      // Essayer de se connecter avec un admin inactif
      const response = await request(app)
        .post('/auth/login')
        .send({
          email,
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Account is inactive');
    });

    test('should reject wrong password', async () => {
      // D'abord créer un admin
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: `wrongpass-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      const { email } = registerRes.body.data;

      // Essayer avec un mauvais mot de passe
      const response = await request(app)
        .post('/auth/login')
        .send({
          email,
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid credentials');
    });

    test('should reject missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: `test-${Date.now()}@test.com`,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /auth/refresh', () => {
    test('should refresh access token with valid refresh token', async () => {
      // D'abord créer et se connecter
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: `refresh-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: registerRes.body.data.email,
          password: 'SecurePass123!',
        });

      const { refreshToken } = loginRes.body;

      // Utiliser le refresh token
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    test('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({ refreshToken: 'invalid.token.here' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid or expired token');
    });

    test('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /auth/logout', () => {
    test('should logout successfully with valid token', async () => {
      // D'abord créer et se connecter
      const registerRes = await request(app)
        .post('/auth/register')
        .send({
          email: `logout-${Date.now()}@test.com`,
          password: 'SecurePass123!',
        });

      expect(registerRes.status).toBe(201);
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: registerRes.body.data.email,
          password: 'SecurePass123!',
        });

      const { accessToken } = loginRes.body;

      // Se déconnecter
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    test('should reject missing token', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Missing or invalid');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid or expired');
    });
  });
});
