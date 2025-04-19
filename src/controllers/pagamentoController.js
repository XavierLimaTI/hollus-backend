import Pagamento from '../models/Pagamento.js';
import Sessao from '../models/Sessao.js';
import { enviarEmailComprovantePagamento } from '../utils/email.js';
import User from '../models/User.js';
import Terapeuta from '../models/Terapeuta.js';
import logger from '../utils/logger.js';
import { processarPagamento } from '../services/pagamentoService.js';

export const criarPagamento = async (req, res) => {
  try {
    const { sessaoId, metodo, valor } = req.body;
    const usuarioId = req.usuario._id;
    
    // Find the session
    const sessao = await Sessao.findById(sessaoId);
    if (!sessao) {
      return res.status(404).json({ erro: 'Sessão não encontrada' });
    }
    
    // Verificar se a sessão pertence ao usuário
    if (sessao.usuario.toString() !== usuarioId.toString()) {
      logger.warn('Tentativa de pagamento para sessão de outro usuário', { usuarioId, sessaoId });
      return res.status(403).json({ erro: 'Você não tem permissão para pagar esta sessão' });
    }
    
    // Process payment with the real integration
    const resultadoPagamento = await processarPagamento(metodo, valor, {
      email: req.usuario.email,
      nome: req.usuario.nome,
      // Other parameters as needed
    });
    
    if (!resultadoPagamento.success) {
      return res.status(400).json({ 
        erro: 'Falha no processamento do pagamento', 
        mensagem: resultadoPagamento.message 
      });
    }
    
    // Criar registro de pagamento
    const pagamento = await Pagamento.create({
      sessao: sessaoId,
      usuario: usuarioId,
      valor,
      status: 'aprovado',
      metodo,
      comprovante: resultadoPagamento.transactionId
    });
    
    // Atualizar sessão como paga
    sessao.pago = true;
    await sessao.save();
    
    // Buscar informações para email
    const usuario = await User.findById(usuarioId);
    const terapeuta = await Terapeuta.findById(sessao.terapeuta);
    
    // Enviar comprovante por email
    await enviarEmailComprovantePagamento(usuario.email, sessao, terapeuta, pagamento);
    
    logger.info('Pagamento processado com sucesso', { 
      pagamentoId: pagamento._id, 
      sessaoId, 
      usuarioId 
    });
    
    res.status(201).json({
      mensagem: 'Pagamento processado com sucesso',
      pagamento
    });
  } catch (error) {
    logger.error('Erro ao processar pagamento', { error: error.message });
    res.status(500).json({ erro: 'Erro ao processar pagamento' });
  }
};

export const listarPagamentos = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    
    const pagamentos = await Pagamento.find({ usuario: usuarioId })
      .populate({
        path: 'sessao',
        populate: {
          path: 'terapeuta',
          select: 'nome especialidade'
        }
      })
      .sort({ createdAt: -1 });
    
    res.json(pagamentos);
  } catch (error) {
    logger.error('Erro ao listar pagamentos', { error: error.message });
    res.status(500).json({ erro: 'Erro ao listar pagamentos' });
  }
};