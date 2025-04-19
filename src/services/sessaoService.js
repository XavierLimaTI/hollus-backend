import Sessao from '../models/Sessao.js';
import User from '../models/User.js';
import Terapeuta from '../models/Terapeuta.js';
import { enviarEmailConfirmacaoSessao, enviarEmailCancelamentoSessao } from '../utils/email.js';
import { criarNotificacao } from '../controllers/notificacaoController.js'; // Adicionar esta importação
import logger from '../utils/logger.js';

export const criarNovaSessao = async (usuarioId, terapeutaId, data, observacoes) => {
  try {
    const novaSessao = await Sessao.create({
      usuario: usuarioId,
      terapeuta: terapeutaId,
      data,
      observacoes,
    });

    logger.info('Sessão criada', { sessaoId: novaSessao._id, usuarioId, terapeutaId });
    return novaSessao;
  } catch (error) {
    logger.error('Erro ao criar sessão', { error: error.message, usuarioId, terapeutaId });
    throw error;
  }
};

export const listarSessoesUsuario = async (usuarioId, filtros = {}) => {
  const query = { usuario: usuarioId };
  
  if (filtros.status) query.status = filtros.status;
  if (filtros.terapeuta) query.terapeuta = filtros.terapeuta;
  if (filtros.data) {
    const dataInicio = new Date(filtros.data);
    const dataFim = new Date(filtros.data);
    dataFim.setHours(23, 59, 59, 999);
    query.data = { $gte: dataInicio, $lte: dataFim };
  }
  
  try {
    const sessoes = await Sessao.find(query)
      .populate('terapeuta', 'nome email especialidade')
      .sort({ data: 1 });
      
    return sessoes;
  } catch (error) {
    logger.error('Erro ao listar sessões', { error: error.message, usuarioId });
    throw error;
  }
};

export const atualizarStatusSessao = async (sessaoId, novoStatus) => {
  try {
    const sessao = await Sessao.findById(sessaoId);
    if (!sessao) {
      throw new Error('Sessão não encontrada');
    }
    
    sessao.status = novoStatus;
    await sessao.save();
    
    const usuario = await User.findById(sessao.usuario);
    const terapeuta = await Terapeuta.findById(sessao.terapeuta);
    
    // Enviar emails conforme o status
    if (novoStatus === 'confirmado') {
      await enviarEmailConfirmacaoSessao(usuario.email, sessao, terapeuta);
      logger.info('Email de confirmação enviado', { sessaoId, usuarioId: usuario._id });
      
      // Adicionar notificação para o usuário
      await criarNotificacao(
        sessao.usuario,
        'Sessão Confirmada',
        `Sua sessão com ${terapeuta.nome} foi confirmada para ${new Date(sessao.data).toLocaleString('pt-BR')}`,
        'sessao',
        { sessaoId: sessao._id }
      );
    } else if (novoStatus === 'cancelado') {
      await enviarEmailCancelamentoSessao(usuario.email, sessao, terapeuta);
      logger.info('Email de cancelamento enviado', { sessaoId, usuarioId: usuario._id });
      
      // Adicionar notificação para o usuário
      await criarNotificacao(
        sessao.usuario,
        'Sessão Cancelada',
        `Sua sessão com ${terapeuta.nome} para ${new Date(sessao.data).toLocaleString('pt-BR')} foi cancelada`,
        'sessao',
        { sessaoId: sessao._id }
      );
    }
    
    return sessao;
  } catch (error) {
    logger.error('Erro ao atualizar status da sessão', { error: error.message, sessaoId });
    throw error;
  }
};