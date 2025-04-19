import express from 'express';
import { criarPagamento, listarPagamentos } from '../controllers/pagamentoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarPagamento);
router.get('/', authMiddleware, listarPagamentos);

export default router;