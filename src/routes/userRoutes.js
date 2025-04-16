import express from 'express';
import {
  criarUsuario,
  loginUsuario,
  listarUsuarios
} from '../controllers/userController.js';
import { autenticarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/users', criarUsuario);                   // Criar usuário
router.post('/login', loginUsuario);                   // Login
router.get('/users', autenticarToken, listarUsuarios); // Listar usuários (protegido)

export default router;
