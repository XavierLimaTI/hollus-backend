import Promocao from '../models/Promocao.js';

export const criarPromocao = async (req, res) => {
  const { terapeuta, titulo, descricao, desconto, validade } = req.body;

  try {
    const novaPromocao = await Promocao.create({ terapeuta, titulo, descricao, desconto, validade });
    res.status(201).json({ mensagem: 'Promoção criada com sucesso!', promocao: novaPromocao });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar promoção.' });
  }
};

export const listarPromocoes = async (req, res) => {
  try {
    const promocoes = await Promocao.find().populate('terapeuta', 'nome');
    res.json(promocoes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar promoções.' });
  }
};