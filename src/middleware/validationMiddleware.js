import { body, validationResult } from 'express-validator';

// Validação para criação de usuário
const validateUser = [
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  body('email')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para terapeuta
const validateTerapeuta = [
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório'),
  body('email')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('especialidade')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Especialidade não pode estar vazia'),
  body('atendimentoOnline')
    .optional()
    .isBoolean()
    .withMessage('Valor inválido para atendimento online'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para sessão
const validateSessao = [
  body('terapeuta')
    .notEmpty()
    .withMessage('ID do terapeuta é obrigatório'),
  body('data')
    .isISO8601()
    .toDate()
    .withMessage('Data inválida'),
  body('observacoes')
    .optional()
    .trim(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para solicitação de reset de senha
const validatePasswordReset = [
  body('email')
    .isEmail()
    .withMessage('E-mail inválido')
    .normalizeEmail(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para redefinição de senha
const validatePasswordChange = [
  body('token')
    .notEmpty()
    .withMessage('Token é obrigatório'),
  body('novaSenha')
    .isLength({ min: 6 })
    .withMessage('A senha deve ter no mínimo 6 caracteres'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validação para promoções
const validatePromocao = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório'),
  body('descricao')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória'),
  body('desconto')
    .isNumeric()
    .withMessage('Desconto deve ser um número')
    .custom(value => value > 0 && value <= 100)
    .withMessage('Desconto deve estar entre 1 e 100'),
  body('validade')
    .isISO8601()
    .toDate()
    .withMessage('Data de validade inválida'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Exportar todas as funções explicitamente
export {
  validateLogin,
  validatePasswordReset,
  validateUser,
  validateTerapeuta,
  validateSessao,
  validatePasswordChange,
  validatePromocao
};