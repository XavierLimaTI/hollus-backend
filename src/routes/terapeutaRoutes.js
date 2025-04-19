import express from 'express';
import {
  criarTerapeuta,
  listarTerapeutas,
  deletarTerapeuta,
  atualizarTerapeuta,
  buscarTerapeutasProximos,
  obterEstatisticasTerapeuta // Adicione esta linha
} from '../controllers/terapeutaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarTerapeuta);
router.get('/', listarTerapeutas);
router.get('/proximos', buscarTerapeutasProximos);
router.get('/estatisticas', authMiddleware, obterEstatisticasTerapeuta); // Nova rota
router.delete('/:id', authMiddleware, deletarTerapeuta);
router.put('/:id', authMiddleware, atualizarTerapeuta);

export default router;
