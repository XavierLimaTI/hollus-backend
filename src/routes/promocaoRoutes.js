import express from 'express';
import { criarPromocao, listarPromocoes } from '../controllers/promocaoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarPromocao);
router.get('/', listarPromocoes);

export default router;