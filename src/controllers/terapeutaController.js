import Terapeuta from '../models/Terapeuta.js';

export const criarTerapeuta = async (req, res) => {
  const { nome, email, especialidade, atendimentoOnline } = req.body;
  try {
    const existente = await Terapeuta.findOne({ email });
    if (existente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const novo = await Terapeuta.create({ nome, email, especialidade, atendimentoOnline });
    res.status(201).json({ mensagem: 'Terapeuta criado com sucesso!', terapeuta: novo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar terapeuta.' });
  }
};

export const listarTerapeutas = async (req, res) => {
  try {
    const lista = await Terapeuta.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar terapeutas.' });
  }
};

export const deletarTerapeuta = async (req, res) => {
  try {
    await Terapeuta.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Terapeuta deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar terapeuta.' });
  }
};

export const atualizarTerapeuta = async (req, res) => {
  const { id } = req.params;
  const { nome, email, especialidade, atendimentoOnline } = req.body;

  try {
    const terapeutaAtualizado = await Terapeuta.findByIdAndUpdate(
      id,
      { nome, email, especialidade, atendimentoOnline },
      { new: true } // retorna o documento atualizado
    );

    if (!terapeutaAtualizado) {
      return res.status(404).json({ erro: 'Terapeuta não encontrado.' });
    }

    res.json({ mensagem: 'Terapeuta atualizado com sucesso!', terapeuta: terapeutaAtualizado });

  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar terapeuta.' });
  }
};
