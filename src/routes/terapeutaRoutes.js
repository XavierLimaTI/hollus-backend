import express from 'express';
import {
  criarTerapeuta,
  listarTerapeutas
} from '../controllers/terapeutaController.js';
import { autenticarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/terapeutas', autenticarToken, criarTerapeuta);
router.get('/terapeutas', autenticarToken, listarTerapeutas);

export default router;
