process.env.JWT_SECRET_KEY = 'testsecret';

jest.mock('../mysql-config', () => ({
  query: jest.fn(),
  connect: jest.fn()
}));

const request = require('supertest');
const app = require('../app');

describe('GET /dashboard without token', () => {
  it('should respond with 401', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.status).toBe(401);
  });
});
