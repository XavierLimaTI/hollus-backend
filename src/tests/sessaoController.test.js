import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { criarSessao, atualizarStatusSessao } from '../controllers/sessaoController.js';
import Sessao from '../models/Sessao.js';
import User from '../models/User.js';
import Terapeuta from '../models/Terapeuta.js';

// Mock dependencies
jest.mock('../utils/email.js', () => ({
  enviarEmail: jest.fn().mockResolvedValue(true),
  enviarEmailConfirmacaoSessao: jest.fn().mockResolvedValue(true),
  enviarEmailCancelamentoSessao: jest.fn().mockResolvedValue(true)
}));

// Test setup
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Sessão Controller', () => {
  test('criarSessao deve criar uma sessão com status pendente', async () => {
    // Setup mock data and request
    const mockUser = await User.create({
      nome: 'Usuário Teste',
      email: 'usuario@teste.com',
      senha: 'senha123'
    });
    
    const mockTerapeuta = await Terapeuta.create({
      nome: 'Terapeuta Teste',
      email: 'terapeuta@teste.com',
      especialidade: 'Reiki'
    });
    
    const req = {
      usuarioId: mockUser._id,
      body: {
        terapeuta: mockTerapeuta._id,
        data: new Date(),
        observacoes: 'Observações teste'
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Execute
    await criarSessao(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'Sessão criada com sucesso!',
        sessao: expect.objectContaining({
          status: 'pendente'
        })
      })
    );
    
    // Verify in database
    const sessao = await Sessao.findOne({ usuario: mockUser._id });
    expect(sessao).toBeTruthy();
    expect(sessao.status).toBe('pendente');
  });
});