import Sessao from '../models/Sessao.js';
import Terapeuta from '../models/Terapeuta.js';
import User from '../models/User.js';
import { 
  enviarEmail, 
  enviarEmailConfirmacaoSessao, 
  enviarEmailCancelamentoSessao 
} from '../utils/email.js';

export const criarSessao = async (req, res) => {
  const { terapeuta, data, observacoes } = req.body;

  try {
    const novaSessao = await Sessao.create({
      usuario: req.usuarioId,
      terapeuta,
      data,
      observacoes,
    });

    const terapeutaInfo = await Terapeuta.findById(terapeuta);
    enviarEmail(
      terapeutaInfo.email,
      'Nova Sessão Agendada',
      `Você tem uma nova sessão agendada para ${data}.`
    );

    res.status(201).json({ mensagem: 'Sessão criada com sucesso!', sessao: novaSessao });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar sessão.' });
  }
};

export const listarSessoes = async (req, res) => {
  try {
    const { status, data, terapeuta } = req.query;
    const filtro = { usuario: req.usuarioId };
    
    // Add filters if provided
    if (status) filtro.status = status;
    if (terapeuta) filtro.terapeuta = terapeuta;
    if (data) {
      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);
      filtro.data = { $gte: dataInicio, $lte: dataFim };
    }
    
    const sessoes = await Sessao.find(filtro)
      .populate('terapeuta', 'nome email especialidade')
      .sort({ data: 1 });
      
    res.json(sessoes);
  } catch (err) {
    console.error('Erro ao listar sessões:', err);
    logger.error('Erro ao listar sessões', { error: err.message });
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

export const atualizarStatusSessao = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const sessao = await Sessao.findById(id);
    if (!sessao) {
      return res.status(404).json({ erro: 'Sessão não encontrada.' });
    }
    
    // Update status
    sessao.status = status;
    await sessao.save();
    
    // Get user and therapist info for email
    const usuario = await User.findById(sessao.usuario);
    const terapeuta = await Terapeuta.findById(sessao.terapeuta);
    
    // Send appropriate email based on status
    if (status === 'confirmado') {
      await enviarEmailConfirmacaoSessao(usuario.email, sessao, terapeuta);
    } else if (status === 'cancelado') {
      await enviarEmailCancelamentoSessao(usuario.email, sessao, terapeuta);
    }
    
    res.json({ 
      mensagem: `Status atualizado para ${status} com sucesso!`, 
      sessao 
    });
  } catch (err) {
    console.error('Erro ao atualizar status da sessão:', err);
    res.status(500).json({ erro: 'Erro ao atualizar status da sessão.' });
  }
};

// Add a new function to get session statistics
export const obterEstatisticasSessoes = async (req, res) => {
  try {
    const totalSessoes = await Sessao.countDocuments({ usuario: req.usuarioId });
    const sessoesConfirmadas = await Sessao.countDocuments({ 
      usuario: req.usuarioId,
      status: 'confirmado'
    });
    const sessoesPendentes = await Sessao.countDocuments({ 
      usuario: req.usuarioId,
      status: 'pendente'
    });
    const sessoesCanceladas = await Sessao.countDocuments({ 
      usuario: req.usuarioId,
      status: 'cancelado'
    });
    
    res.json({
      total: totalSessoes,
      confirmadas: sessoesConfirmadas,
      pendentes: sessoesPendentes,
      canceladas: sessoesCanceladas
    });
  } catch (err) {
    console.error('Erro ao obter estatísticas:', err);
    res.status(500).json({ erro: 'Erro ao obter estatísticas de sessões.' });
  }
};

// Add this new function to get sessions for a therapist
export const listarSessoesTerapeuta = async (req, res) => {
  try {
    const { status, data } = req.query;
    const terapeutaId = req.params.terapeutaId || req.usuarioId;
    
    const filtro = { terapeuta: terapeutaId };
    
    // Add filters if provided
    if (status) filtro.status = status;
    if (data) {
      const dataInicio = new Date(data);
      const dataFim = new Date(data);
      dataFim.setHours(23, 59, 59, 999);
      filtro.data = { $gte: dataInicio, $lte: dataFim };
    }
    
    const sessoes = await Sessao.find(filtro)
      .populate('usuario', 'nome email')
      .sort({ data: 1 });
      
    res.json(sessoes);
  } catch (err) {
    console.error('Erro ao listar sessões do terapeuta:', err);
    res.status(500).json({ erro: 'Erro ao listar sessões do terapeuta.' });
  }
};

// Add a function to get upcoming sessions for notifications
export const obterSessoesProximas = async (req, res) => {
  try {
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(amanha.getDate() + 1);
    
    // Find sessions happening in the next 24 hours
    const sessoesProximas = await Sessao.find({
      usuario: req.usuarioId,
      data: { $gte: agora, $lte: amanha },
      status: 'confirmado'
    }).populate('terapeuta', 'nome email especialidade');
    
    res.json(sessoesProximas);
  } catch (err) {
    console.error('Erro ao obter sessões próximas:', err);
    res.status(500).json({ erro: 'Erro ao obter sessões próximas.' });
  }
};
