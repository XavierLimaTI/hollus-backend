import { atualizarSessao } from '../controllers/sessaoController.js';
import express from 'express';
import { criarSessao, listarSessoes, deletarSessao } from '../controllers/sessaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, criarSessao);
router.get('/', authMiddleware, listarSessoes);
router.delete('/:id', authMiddleware, deletarSessao);
router.put('/:id', authMiddleware, atualizarSessao);


export default router;
// Compare this snippet from hollus-backend/src/models/Sessao.js: