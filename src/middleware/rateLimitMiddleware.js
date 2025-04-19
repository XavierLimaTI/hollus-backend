import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // limitar cada IP a 5 solicitações por janela
  standardHeaders: true, // Retornar info no header `RateLimit-*`
  legacyHeaders: false, // Desabilitar headers `X-RateLimit-*`
  message: { 
    erro: 'Muitas tentativas de login. Por favor, tente novamente após 15 minutos.' 
  }
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // limitar cada IP a 60 solicitações por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    erro: 'Muitas requisições realizadas. Por favor, tente novamente mais tarde.' 
  }
});