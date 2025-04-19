import * as authService from '../services/authService.js';
import logger from '../utils/logger.js';

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;
    logger.info('Tentativa de login', { email });
    
    const usuario = await authService.login(email, senha);
    
    logger.info('Login realizado com sucesso', { userId: usuario.id });
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario
    });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      logger.warn('Tentativa de login com usuário inexistente', { email: req.body.email });
      return res.status(400).json({ erro: 'Usuário não encontrado.' });
    }
    
    if (err.message === 'Senha inválida') {
      logger.warn('Tentativa de login com senha inválida', { email: req.body.email });
      return res.status(401).json({ erro: 'Senha inválida.' });
    }
    
    logger.error('Erro ao fazer login', { error: err.message, stack: err.stack });
    res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
};

export const solicitarRecuperacaoSenha = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.recuperarSenha(email);
    res.json({ mensagem: 'Email de recuperação enviado com sucesso!' });
  } catch (err) {
    if (err.message === 'Usuário não encontrado') {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    
    console.error('Erro ao solicitar recuperação:', err);
    res.status(500).json({ erro: 'Erro ao processar solicitação de recuperação de senha.' });
  }
};

export const redefinirSenha = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;
    await authService.redefinirSenha(token, novaSenha);
    res.json({ mensagem: 'Senha redefinida com sucesso!' });
  } catch (err) {
    if (err.message === 'Token inválido ou expirado') {
      return res.status(400).json({ erro: 'Token inválido ou expirado.' });
    }
    
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ erro: 'Erro ao redefinir senha.' });
  }
};
