import express from 'express';
import {
  criarTerapeuta,
  listarTerapeutas,
  deletarTerapeuta,
  atualizarTerapeuta
} from '../controllers/terapeutaController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, criarTerapeuta);
router.get('/', listarTerapeutas);
router.delete('/:id', authMiddleware, deletarTerapeuta);
router.put('/:id', authMiddleware, atualizarTerapeuta);

// Middleware de autenticação para proteger as rotas


export default router;
