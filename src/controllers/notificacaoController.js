import Notificacao from '../models/Notificacao.js';
import { enviarNotificacao } from '../services/websocketService.js';
import logger from '../utils/logger.js';

export const listarNotificacoes = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const { lidas } = req.query;
    
    const filtro = { usuario: usuarioId };
    if (lidas !== undefined) {
      filtro.lida = lidas === 'true';
    }
    
    const notificacoes = await Notificacao.find(filtro)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao listar notificações', { error: error.message });
    res.status(500).json({ erro: 'Erro ao listar notificações' });
  }
};

export const marcarComoLida = async (req, res) => {
  try {
    const { notificacaoId } = req.params;
    const usuarioId = req.usuario._id;
    
    const notificacao = await Notificacao.findById(notificacaoId);
    
    if (!notificacao) {
      return res.status(404).json({ erro: 'Notificação não encontrada' });
    }
    
    if (notificacao.usuario.toString() !== usuarioId.toString()) {
      console.warn('Tentativa de marcar notificação de outro usuário como lida', 
        { usuarioId, notificacaoId });
      return res.status(403).json({ erro: 'Você não tem permissão para esta ação' });
    }
    
    notificacao.lida = true;
    await notificacao.save();
    
    res.json({ mensagem: 'Notificação marcada como lida' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida', { error: error.message });
    res.status(500).json({ erro: 'Erro ao marcar notificação como lida' });
  }
};

export const marcarTodasComoLidas = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    
    await Notificacao.updateMany(
      { usuario: usuarioId, lida: false },
      { lida: true }
    );
    
    res.json({ mensagem: 'Todas as notificações foram marcadas como lidas' });
  } catch (error) {
    console.error('Erro ao marcar todas notificações como lidas', { error: error.message });
    res.status(500).json({ erro: 'Erro ao marcar notificações como lidas' });
  }
};

export const criarNotificacao = async (usuarioId, titulo, mensagem, tipo, dados = {}) => {
  try {
    // Criar notificação no banco de dados
    const notificacao = await Notificacao.create({
      usuario: usuarioId,
      titulo,
      mensagem,
      tipo,
      dados
    });
    
    return notificacao;
  } catch (error) {
    console.error('Erro ao criar notificação', { error: error.message });
    throw error;
  }
};