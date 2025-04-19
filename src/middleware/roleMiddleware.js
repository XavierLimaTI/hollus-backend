import logger from '../utils/logger.js';

export const isAdmin = (req, res, next) => {
  if (req.usuario.role !== 'admin') {
    logger.warn('Tentativa de acesso a rota de admin por usuário não autorizado', {
      userId: req.usuario._id,
      role: req.usuario.role
    });
    return res.status(403).json({ erro: 'Acesso negado. Permissão de administrador necessária.' });
  }
  next();
};

export const isTerapeuta = (req, res, next) => {
  if (req.usuario.role !== 'terapeuta') {
    logger.warn('Tentativa de acesso a rota de terapeuta por usuário não autorizado', {
      userId: req.usuario._id,
      role: req.usuario.role
    });
    return res.status(403).json({ erro: 'Acesso negado. Permissão de terapeuta necessária.' });
  }
  next();
};