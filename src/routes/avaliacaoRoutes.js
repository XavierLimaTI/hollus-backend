import express from 'express';
import { criarAvaliacao, listarAvaliacoesTerapeuta, minhasAvaliacoes, excluirAvaliacao } from '../controllers/avaliacaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/terapeuta/:terapeutaId', listarAvaliacoesTerapeuta);

// Rotas protegidas
router.post('/', authMiddleware, criarAvaliacao);
router.get('/minhas', authMiddleware, minhasAvaliacoes);
router.get('/terapeuta/me', authMiddleware, listarAvaliacoesTerapeuta);
router.delete('/:avaliacaoId', authMiddleware, excluirAvaliacao);

export default router;