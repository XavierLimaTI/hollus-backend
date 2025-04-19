import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { enviarEmailRecuperacaoSenha } from '../utils/email.js';

export const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
};

export const login = async (email, senha) => {
  const usuario = await User.findOne({ email });
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha inválida');
  }

  const token = gerarToken(usuario._id);

  return {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    token
  };
};

export const recuperarSenha = async (email) => {
  const usuario = await User.findOne({ email });
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  // Gerar token de recuperação
  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetTokenExpiracao = Date.now() + 3600000; // 1 hora

  // Salvar token no usuário
  usuario.resetPasswordToken = resetToken;
  usuario.resetPasswordExpires = resetTokenExpiracao;
  await usuario.save();

  // Enviar email
  await enviarEmailRecuperacaoSenha(usuario.email, resetToken);

  return true;
};

export const redefinirSenha = async (token, novaSenha) => {
  const usuario = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!usuario) {
    throw new Error('Token inválido ou expirado');
  }

  // Hash da nova senha
  usuario.senha = novaSenha;
  
  // Limpar tokens de recuperação
  usuario.resetPasswordToken = undefined;
  usuario.resetPasswordExpires = undefined;
  
  await usuario.save();

  return true;
};