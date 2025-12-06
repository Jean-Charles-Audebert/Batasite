import request from 'supertest';
import app from '../app.js';

describe('Content API Endpoints', () => {
  describe('GET /api/content/client/:clientId', () => {
    it('should return content for a specific client', async () => {
      const res = await request(app).get('/api/content/client/1');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/content/:id', () => {
    it('should return 404 for non-existent content', async () => {
      const res = await request(app).get('/api/content/99999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/content', () => {
    it('should create new content with valid data', async () => {
      const newContent = {
        client_id: 1,
        title: 'Test Content',
        content_type: 'text',
        body: 'This is test content',
        media_url: null,
        published: true
      };
      
      const res = await request(app)
        .post('/api/content')
        .send(newContent);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newContent.title);
    });
  });
});
