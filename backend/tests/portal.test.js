import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('RTO SmartQueue AI — Portal & Road Safety API Suite', () => {
  it('GET /api/announcements returns verified transport advisories', async () => {
    const res = await request(app).get('/api/announcements');
    expect(res.status).toBe(200);
    expect(res.body.announcements).toBeInstanceOf(Array);
    expect(res.body.announcements.length).toBeGreaterThan(0);
    expect(res.body.announcements[0]).toHaveProperty('title');
    expect(res.body.announcements[0]).toHaveProperty('category');
  });

  it('GET /api/road-safety/signs returns categorized traffic signs', async () => {
    const res = await request(app).get('/api/road-safety/signs');
    expect(res.status).toBe(200);
    expect(res.body.signs).toBeInstanceOf(Array);
    expect(res.body.signs.length).toBeGreaterThan(0);
    expect(res.body.signs[0]).toHaveProperty('meaning');
  });

  it('GET /api/road-safety/questions returns mock test questions', async () => {
    const res = await request(app).get('/api/road-safety/questions');
    expect(res.status).toBe(200);
    expect(res.body.questions).toBeInstanceOf(Array);
    expect(res.body.questions.length).toBeGreaterThan(0);
    expect(res.body.questions[0]).toHaveProperty('explanation');
  });

  it('GET /api/road-safety/leaderboard returns district rankings', async () => {
    const res = await request(app).get('/api/road-safety/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.leaderboard).toBeInstanceOf(Array);
    expect(res.body.leaderboard.length).toBeGreaterThan(0);
  });

  it('POST /api/feedback accepts valid citizen feedback', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({
        name: 'Pooja Patil',
        email: 'pooja@example.com',
        phone: '9820011223',
        subject: 'Feedback',
        message: 'Excellent queue wait-time estimation at Pune RTO.'
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.feedback).toHaveProperty('id');
  });

  it('POST /api/feedback rejects submission with missing fields (400)', async () => {
    const res = await request(app)
      .post('/api/feedback')
      .send({ name: 'Incomplete' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
