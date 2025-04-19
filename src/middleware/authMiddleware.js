import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Middleware unificado de autenticação
export const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se o token foi enviado no header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer TOKEN
    
    if (!token) {
      logger.warn('Tentativa de acesso sem token');
      return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }
    
    // Verificar a validade do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    
    // Verificar se o usuário ainda existe
    const usuario = await User.findById(decoded.id).select('-senha');
    if (!usuario) {
      logger.warn('Tentativa de acesso com token de usuário inexistente', { userId: decoded.id });
      return res.status(401).json({ erro: 'Usuário não encontrado.' });
    }
    
    // Adicionar o usuário ao objeto de requisição
    req.usuario = usuario;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Tentativa de acesso com token inválido');
      return res.status(401).json({ erro: 'Token inválido.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn('Tentativa de acesso com token expirado');
      return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
    }
    
    logger.error('Erro na autenticação', { error: error.message });
    res.status(500).json({ erro: 'Erro na autenticação.' });
  }
};

// Para compatibilidade com código existente
export const autenticarToken = authMiddleware;

// Middleware para verificar se o usuário é administrador
export const autenticarAdmin = (req, res, next) => {
  if (!req.usuario || !req.usuario.isAdmin) {
    logger.warn('Tentativa de acesso a rota de admin', { userId: req.usuario?._id });
    return res.status(403).json({ erro: 'Acesso negado. Permissões insuficientes.' });
  }
  next();
};
