import express from 'express';
import { getPostagens, getPostagem, criarPostagem, atualizarPostagem, deletarPostagem } from '../controllers/blogController.js';
import { autenticarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/', getPostagens);
router.get('/:id', getPostagem);

// Rotas protegidas (apenas administradores)
router.post('/', autenticarToken, criarPostagem);
router.put('/:id', autenticarToken, atualizarPostagem);
router.delete('/:id', autenticarToken, deletarPostagem);

export default router;