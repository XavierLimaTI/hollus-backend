import express from 'express';
import { listarNotificacoes, marcarComoLida, marcarTodasComoLidas } from '../controllers/notificacaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // Todas as rotas de notificação precisam de autenticação

router.get('/', listarNotificacoes);
router.patch('/:notificacaoId/lida', marcarComoLida);
router.patch('/todas/lidas', marcarTodasComoLidas);

export default router;