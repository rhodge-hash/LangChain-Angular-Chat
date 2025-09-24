import request from 'supertest';
import app from '../../src/app.js'; // Assuming app.js will be in backend/src

describe('POST /api/advanced-agent-chat contract', () => {
  it('should return 200 with a valid response for a valid prompt and session', async () => {
    const response = await request(app)
      .post('/api/advanced-agent-chat')
      .send({ prompt: 'Hello agent', sessionId: 'test-session-123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('output');
    expect(typeof response.body.output).toBe('string');
    // intermediateSteps and memoryState are optional, so we don't assert their presence
  });

  it('should return 400 for an empty prompt', async () => {
    const response = await request(app)
      .post('/api/advanced-agent-chat')
      .send({ prompt: '', sessionId: 'test-session-123' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Prompt cannot be empty.');
  });

  it('should return 400 if prompt is missing', async () => {
    const response = await request(app)
      .post('/api/advanced-agent-chat')
      .send({ sessionId: 'test-session-123' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});