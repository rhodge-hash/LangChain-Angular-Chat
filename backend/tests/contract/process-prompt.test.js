const request = require('supertest');
const app = require('../../src/app'); // Assuming app.js will be in backend/src

describe('POST /api/process-prompt contract', () => {
  it('should return 200 with a valid response for a valid prompt', async () => {
    const response = await request(app)
      .post('/api/process-prompt')
      .send({ prompt: 'Hello agent' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(typeof response.body.response).toBe('string');
  });

  it('should return 400 for an empty prompt', async () => {
    const response = await request(app)
      .post('/api/process-prompt')
      .send({ prompt: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Prompt cannot be empty.');
  });

  it('should return 400 if prompt is missing', async () => {
    const response = await request(app)
      .post('/api/process-prompt')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
