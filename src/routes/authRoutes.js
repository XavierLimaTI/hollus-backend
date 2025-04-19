import express from 'express';
import { loginUsuario, solicitarRecuperacaoSenha, redefinirSenha } from '../controllers/authController.js';
import { validateLogin, validatePasswordReset } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/login', validateLogin, loginUsuario);
router.post('/reset-password', validatePasswordReset, solicitarRecuperacaoSenha);
router.post('/reset-password/confirm', validatePasswordReset, redefinirSenha);

export default router;