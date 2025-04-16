import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Criação de usuário com senha criptografada
export async function criarUsuario(req, res) {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Usuário já existe.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({ nome, email, senha: senhaCriptografada });

    await novoUsuario.save();

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        criadoEm: novoUsuario.criadoEm
      }
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
}

// Login do usuário e geração de token JWT
export async function loginUsuario(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha inválida.' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no login.' });
  }
}
// Listar todos os usuários (rota protegida)
export async function listarUsuarios(req, res) {
  try {
    const usuarios = await User.find().select('-senha'); // exclui senha
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
}
