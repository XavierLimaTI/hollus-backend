import express from 'express';
import { 
  criarSessao, 
  listarSessoes, 
  deletarSessao, 
  atualizarSessao,
  atualizarStatusSessao,
  obterEstatisticasSessoes,
  listarSessoesTerapeuta,
  obterSessoesProximas
} from '../controllers/sessaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarSessao);
router.get('/', authMiddleware, listarSessoes);
router.get('/estatisticas', authMiddleware, obterEstatisticasSessoes);
router.get('/proximas', authMiddleware, obterSessoesProximas);
router.get('/terapeuta/:terapeutaId?', authMiddleware, listarSessoesTerapeuta);
router.delete('/:id', authMiddleware, deletarSessao);
router.put('/:id', authMiddleware, atualizarSessao);
router.patch('/:id/status', authMiddleware, atualizarStatusSessao);

export default router;