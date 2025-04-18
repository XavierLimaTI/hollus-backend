import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2d'
  });
};

export const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const novoUser = await User.create({ nome, email, senha });

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      usuario: {
        id: novoUser._id,
        nome: novoUser.nome,
        email: novoUser.email,
        criadoEm: novoUser.createdAt,
        token: gerarToken(novoUser._id)
      }
    });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
};


export const listarUsuarios = async (req, res) => {
  const usuarios = await User.find().select('-senha');
  res.json(usuarios);
};
