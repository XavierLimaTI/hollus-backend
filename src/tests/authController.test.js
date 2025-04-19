import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../index.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller', () => {
  test('should login a user with valid credentials', async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      nome: 'Test User',
      email: 'test@example.com',
      senha: hashedPassword
    });
    
    // Attempt to login
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        senha: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});