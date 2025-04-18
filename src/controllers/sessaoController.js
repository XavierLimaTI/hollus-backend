import Sessao from '../models/Sessao.js';

export const criarSessao = async (req, res) => {
  const { terapeuta, data, observacoes } = req.body;

  try {
    const novaSessao = await Sessao.create({
      usuario: req.usuarioId,
      terapeuta,
      data,
      observacoes
    });

    res.status(201).json({ mensagem: 'Sessão criada com sucesso!', sessao: novaSessao });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar sessão.' });
  }
};

export const listarSessoes = async (req, res) => {
  try {
    const sessoes = await Sessao.find({ usuario: req.usuarioId }).populate('terapeuta', 'nome email');
    res.json(sessoes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar sessões.' });
  }
};

export const deletarSessao = async (req, res) => {
  try {
    await Sessao.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Sessão deletada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao deletar sessão.' });
  }
};

export const atualizarSessao = async (req, res) => {
    const { id } = req.params;
    const { terapeuta, data, observacoes } = req.body;
  
    try {
      const sessaoAtualizada = await Sessao.findByIdAndUpdate(
        id,
        { terapeuta, data, observacoes },
        { new: true }
      );
  
      if (!sessaoAtualizada) {
        return res.status(404).json({ erro: 'Sessão não encontrada.' });
      }
  
      res.json({ mensagem: 'Sessão atualizada com sucesso!', sessao: sessaoAtualizada });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar sessão.' });
    }
  };
  