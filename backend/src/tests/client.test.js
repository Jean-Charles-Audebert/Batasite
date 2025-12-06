import request from 'supertest';
import app from '../app.js';

describe('Client API Endpoints', () => {
  describe('GET /api/clients', () => {
    it('should return all clients', async () => {
      const res = await request(app).get('/api/clients');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/clients/:identifier', () => {
    it('should return 404 for non-existent client', async () => {
      const res = await request(app).get('/api/clients/99999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/clients', () => {
    it('should create a new client with valid data', async () => {
      const newClient = {
        name: 'Test Client',
        slug: 'test-client-' + Date.now(),
        description: 'A test client',
        logo_url: '/test-logo.png',
        active: true
      };
      
      const res = await request(app)
        .post('/api/clients')
        .send(newClient);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newClient.name);
      expect(res.body.slug).toBe(newClient.slug);
    });
  });
});

describe('Health Check', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
