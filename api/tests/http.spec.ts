import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('HTTP API', () => {
  const app = createApp();

  it('returns a health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('rejects protected task requests without a token', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe('HTTP_401');
  });
});
