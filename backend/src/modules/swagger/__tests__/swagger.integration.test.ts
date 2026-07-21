import request from 'supertest';
import app from '../../../app';

describe('Swagger Documentation', () => {
  it('should serve Swagger UI at /api/docs/', async () => {
    const res = await request(app).get('/api/docs/');
    
    // RED Phase: This will fail with 404 until Swagger is mounted
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
    expect(res.text).toContain('swagger-ui');
  });

  it('should serve the OpenAPI JSON spec at /api/docs.json', async () => {
    const res = await request(app).get('/api/docs.json');
    
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body).toHaveProperty('info.title', 'Motovra API');
  });
});
