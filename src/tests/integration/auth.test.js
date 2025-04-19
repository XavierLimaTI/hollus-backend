import request from 'supertest';
import app from '../../index';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt';
import mongoose from 'mongoose';

describe('Authentication API', () => {
  beforeAll(async () => {
    // Conectar ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpar usuários antes de cada teste
    await User.deleteMany({});
  });

  test('Deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Teste User',
        email: 'teste@example.com',
        senha: 'Senha@123',
        telefone: '11999999999'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario.email).toEqual('teste@example.com');
  });

  test('Deve fazer login com credenciais válidas', async () => {
    // Criar um usuário para teste
    await User.create({
      nome: 'Teste User',
      email: 'teste@example.com',
      senha: '$2a$10$somehashedpassword', // hash da senha "Senha@123"
      telefone: '11999999999'
    });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@example.com',
        senha: 'Senha@123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('usuario');
    expect(res.body).toHaveProperty('token');
  });

  test('Deve rejeitar login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'teste@example.com',
        senha: 'senhaerrada'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});