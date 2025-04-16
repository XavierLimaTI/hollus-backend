import Terapeuta from '../models/Terapeuta.js';

// Criar terapeuta
export async function criarTerapeuta(req, res) {
  try {
    const { nome, email, especialidade, atendimentoOnline } = req.body;

    const existente = await Terapeuta.findOne({ email });
    if (existente) {
      return res.status(400).json({ erro: 'Terapeuta já cadastrado com este e-mail.' });
    }

    const novo = new Terapeuta({ nome, email, especialidade, atendimentoOnline });
    await novo.save();

    res.status(201).json({ mensagem: 'Terapeuta criado com sucesso!', terapeuta: novo });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar terapeuta.' });
  }
}

// Listar todos os terapeutas
export async function listarTerapeutas(req, res) {
  try {
    const terapeutas = await Terapeuta.find();
    res.json(terapeutas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar terapeutas.' });
  }
}
