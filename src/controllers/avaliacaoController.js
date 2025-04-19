import Avaliacao from '../models/Avaliacao.js';
import Terapeuta from '../models/Terapeuta.js';
import Sessao from '../models/Sessao.js'; // Adicionar esta importação
import logger from '../utils/logger.js';

export const criarAvaliacao = async (req, res) => {
  try {
    const { terapeutaId, nota, comentario, sessaoId } = req.body;
    const usuarioId = req.usuario._id;
    
    // Verificar se o terapeuta existe
    const terapeuta = await Terapeuta.findById(terapeutaId);
    if (!terapeuta) {
      return res.status(404).json({ erro: 'Terapeuta não encontrado.' });
    }
    
    // Verificar se o usuário já avaliou este terapeuta
    const avaliacaoExistente = await Avaliacao.findOne({
      terapeuta: terapeutaId,
      usuario: usuarioId
    });
    
    let resultado;
    
    if (avaliacaoExistente) {
      // Atualizar avaliação existente
      avaliacaoExistente.nota = nota;
      avaliacaoExistente.comentario = comentario;
      await avaliacaoExistente.save();
      
      logger.info('Avaliação atualizada', { id: avaliacaoExistente._id });
      resultado = {
        mensagem: 'Avaliação atualizada com sucesso!',
        avaliacao: avaliacaoExistente
      };
    } else {
      // Criar nova avaliação
      const novaAvaliacao = await Avaliacao.create({
        terapeuta: terapeutaId,
        usuario: usuarioId,
        nota,
        comentario
      });
      
      logger.info('Nova avaliação criada', { id: novaAvaliacao._id });
      resultado = {
        mensagem: 'Avaliação criada com sucesso!',
        avaliacao: novaAvaliacao
      };
    }
    
    // Se foi fornecido um ID de sessão, marcar a sessão como avaliada
    if (sessaoId) {
      await Sessao.findByIdAndUpdate(
        sessaoId,
        { avaliado: true },
        { new: true }
      );
      logger.info('Sessão marcada como avaliada', { sessaoId });
    }
    
    res.status(201).json(resultado);
  } catch (error) {
    logger.error('Erro ao criar/atualizar avaliação', { error: error.message });
    res.status(500).json({ erro: 'Erro ao processar avaliação.' });
  }
};

export const listarAvaliacoesTerapeuta = async (req, res) => {
  try {
    // Se o parâmetro for 'me', usar o ID do usuário logado
    const terapeutaId = req.params.terapeutaId === 'me' ? req.usuario._id : req.params.terapeutaId;
    
    // Verificar se o terapeuta existe
    const terapeuta = await Terapeuta.findById(terapeutaId);
    if (!terapeuta) {
      return res.status(404).json({ erro: 'Terapeuta não encontrado.' });
    }
    
    // Buscar avaliações
    const avaliacoes = await Avaliacao.find({ terapeuta: terapeutaId })
      .populate('usuario', 'nome')
      .sort({ createdAt: -1 });
    
    // Calcular média
    const totalAvaliacoes = avaliacoes.length;
    const somaNotas = avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
    const media = totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;
    
    res.json({
      avaliacoes,
      estatisticas: {
        total: totalAvaliacoes,
        media: parseFloat(media.toFixed(1))
      }
    });
  } catch (error) {
    logger.error('Erro ao listar avaliações', { error: error.message });
    res.status(500).json({ erro: 'Erro ao listar avaliações.' });
  }
};

export const minhasAvaliacoes = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    
    const avaliacoes = await Avaliacao.find({ usuario: usuarioId })
      .populate('terapeuta', 'nome especialidade')
      .sort({ createdAt: -1 });
    
    res.json(avaliacoes);
  } catch (error) {
    logger.error('Erro ao listar avaliações do usuário', { error: error.message });
    res.status(500).json({ erro: 'Erro ao listar avaliações.' });
  }
};

export const excluirAvaliacao = async (req, res) => {
  try {
    const { avaliacaoId } = req.params;
    const usuarioId = req.usuario._id;
    
    const avaliacao = await Avaliacao.findById(avaliacaoId);
    
    if (!avaliacao) {
      return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    }
    
    // Verificar se a avaliação pertence ao usuário
    if (avaliacao.usuario.toString() !== usuarioId.toString()) {
      logger.warn('Tentativa de exclusão de avaliação por usuário não autorizado', 
        { userId: usuarioId, avaliacaoId });
      return res.status(403).json({ erro: 'Você não tem permissão para excluir esta avaliação.' });
    }
    
    await avaliacao.remove();
    
    logger.info('Avaliação excluída', { id: avaliacaoId });
    res.json({ mensagem: 'Avaliação excluída com sucesso!' });
  } catch (error) {
    logger.error('Erro ao excluir avaliação', { error: error.message });
    res.status(500).json({ erro: 'Erro ao excluir avaliação.' });
  }
};