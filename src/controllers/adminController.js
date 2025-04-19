import Terapeuta from '../models/Terapeuta.js';
import Sessao from '../models/Sessao.js';
import User from '../models/User.js';
import Pagamento from '../models/Pagamento.js';
import logger from '../utils/logger.js';

export const getTerapeutasAdmin = async (req, res) => {
  try {
    const terapeutas = await Terapeuta.find()
      .select('nome email especialidade avaliacaoMedia atendimentoOnline createdAt');
    
    // Enrich with session stats
    const enrichedTerapeutas = await Promise.all(terapeutas.map(async (terapeuta) => {
      const sessoes = await Sessao.countDocuments({ terapeuta: terapeuta._id });
      const clientesAtendidos = await Sessao.distinct('usuario', { 
        terapeuta: terapeuta._id, 
        status: 'confirmado' 
      });
      const faturamento = await Pagamento.aggregate([
        { $match: { terapeuta: terapeuta._id, status: 'aprovado' } },
        { $group: { _id: null, total: { $sum: '$valor' } } }
      ]);
      
      return {
        ...terapeuta._doc,
        sessoes,
        clientesAtendidos: clientesAtendidos.length,
        faturamento: faturamento[0]?.total || 0
      };
    }));
    
    res.json(enrichedTerapeutas);
  } catch (error) {
    logger.error('Erro ao obter lista de terapeutas para admin', { error: error.message });
    res.status(500).json({ erro: 'Erro ao obter terapeutas' });
  }
};