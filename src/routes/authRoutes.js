import express from 'express';
import { loginUsuario } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUsuario);

export default router;
// Rota de login para autenticação de usuários
// router.post('/login', loginUsuario);