import Sessao from '../models/Sessao.js';
import User from '../models/User.js';
import Terapeuta from '../models/Terapeuta.js';
import Avaliacao from '../models/Avaliacao.js';
import Pagamento from '../models/Pagamento.js';
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Função para obter a data de início com base no período selecionado
const getStartDate = (period) => {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'month':
      return new Date(now.setMonth(now.getMonth() - 1));
    case 'quarter':
      return new Date(now.setMonth(now.getMonth() - 3));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return new Date(now.setMonth(now.getMonth() - 1)); // Default to month
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { period = 'month', type = 'all' } = req.query;
    const startDate = getStartDate(period);
    
    // Dados base que serão retornados independente do tipo
    const baseData = {
      period,
      generatedAt: new Date()
    };
    
    // Estatísticas de sessões
    if (type === 'all' || type === 'sessions') {
      const completedSessions = await Sessao.countDocuments({
        status: 'confirmado',
        data: { $gte: startDate }
      });
      
      const totalSessions = await Sessao.countDocuments({
        data: { $gte: startDate }
      });
      
      const completionRate = totalSessions > 0 
        ? (completedSessions / totalSessions * 100).toFixed(2)
        : 0;
      
      const sessoesPorPeriodo = await getPeriodData(period, startDate);
      
      Object.assign(baseData, {
        completedSessions,
        totalSessions,
        completionRate,
        sessionsByPeriod: sessoesPorPeriodo
      });
    }
    
    // Estatísticas de avaliações
    if (type === 'all' || type === 'ratings') {
      const avaliacoes = await Avaliacao.find({
        createdAt: { $gte: startDate }
      });
      
      const totalRatings = avaliacoes.length;
      const averageRating = totalRatings > 0
        ? avaliacoes.reduce((sum, av) => sum + av.nota, 0) / totalRatings
        : 0;
      
      Object.assign(baseData, {
        totalRatings,
        averageRating
      });
    }
    
    // Distribuição de especialidades
    if (type === 'all') {
      const sessoes = await Sessao.find({
        data: { $gte: startDate }
      }).populate('terapeuta', 'especialidade');
      
      const specialtyCount = {};
      sessoes.forEach(sessao => {
        if (sessao.terapeuta?.especialidade) {
          const esp = sessao.terapeuta.especialidade;
          specialtyCount[esp] = (specialtyCount[esp] || 0) + 1;
        }
      });
      
      const specialtyDistribution = Object.entries(specialtyCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 especialidades
      
      Object.assign(baseData, {
        specialtyDistribution
      });
    }
    
    // Taxa de retenção (clientes que voltam)
    if (type === 'all' || type === 'retention') {
      const retentionData = await calculateRetentionRate(period);
      
      Object.assign(baseData, {
        retentionRate: retentionData
      });
    }
    
    logger.info('Analytics data generated', { period, type });
    res.json(baseData);
  } catch (error) {
    logger.error('Error generating analytics', { error: error.message });
    res.status(500).json({ erro: 'Erro ao gerar dados analíticos' });
  }
};

export const getUserStatistics = async (req, res) => {
  try {
    // Total de usuários
    const totalUsers = await User.countDocuments();
    
    // Novos usuários este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    // Distribuição de usuários por tipo
    const userTypes = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalUsers,
      newUsers,
      userTypes: userTypes.map(type => ({
        type: type._id || 'user',
        count: type.count
      }))
    });
  } catch (error) {
    logger.error('Error getting user statistics', { error: error.message });
    res.status(500).json({ erro: 'Erro ao obter estatísticas de usuários' });
  }
};

export const getRevenueStatistics = async (req, res) => {
  try {
    // Total de receita
    const pagamentos = await Pagamento.find({ status: 'aprovado' });
    const totalRevenue = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    
    // Receita do último mês
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthRevenue = pagamentos
      .filter(p => p.createdAt >= lastMonth)
      .reduce((sum, p) => sum + p.valor, 0);
    
    // Receita do mês anterior (para cálculo de crescimento)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    const previousMonthRevenue = pagamentos
      .filter(p => p.createdAt >= twoMonthsAgo && p.createdAt < lastMonth)
      .reduce((sum, p) => sum + p.valor, 0);
    
    // Cálculo de crescimento percentual
    const growthPercentage = previousMonthRevenue > 0
      ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(2)
      : 100;
    
    // Dados de receita mensal para o gráfico
    const monthlyRevenue = await getMonthlyRevenue();
    
    res.json({
      totalRevenue,
      lastMonthRevenue,
      growthPercentage,
      monthlyRevenue
    });
  } catch (error) {
    logger.error('Error getting revenue statistics', { error: error.message });
    res.status(500).json({ erro: 'Erro ao obter estatísticas de receita' });
  }
};

export const getTherapistPerformance = async (req, res) => {
  try {
    // Top terapeutas por número de sessões
    const therapistSessions = await Sessao.aggregate([
      { $match: { status: 'confirmado' } },
      {
        $group: {
          _id: "$terapeuta",
          sessions: { $sum: 1 }
        }
      },
      { $sort: { sessions: -1 } },
      { $limit: 5 }
    ]);
    
    const therapistIds = therapistSessions.map(t => t._id);
    
    // Buscar informações detalhadas dos terapeutas
    const therapists = await Terapeuta.find({
      _id: { $in: therapistIds }
    });
    
    // Buscar avaliações médias
    const ratings = await Avaliacao.aggregate([
      { 
        $match: { 
          terapeuta: { $in: therapistIds } 
        } 
      },
      {
        $group: {
          _id: "$terapeuta",
          rating: { $avg: "$nota" }
        }
      }
    ]);
    
    // Combinar dados para retorno
    const topTherapists = therapistSessions.map(ts => {
      const therapist = therapists.find(t => t._id.toString() === ts._id.toString());
      const ratingData = ratings.find(r => r._id.toString() === ts._id.toString());
      
      return {
        id: ts._id,
        name: therapist?.nome || 'Terapeuta',
        specialty: therapist?.especialidade || 'Não especificada',
        sessions: ts.sessions,
        rating: ratingData?.rating || 0
      };
    });
    
    res.json({ topTherapists });
  } catch (error) {
    logger.error('Error getting therapist performance', { error: error.message });
    res.status(500).json({ erro: 'Erro ao obter desempenho dos terapeutas' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const usuariosTotal = await User.countDocuments();
    const terapeutasTotal = await Terapeuta.countDocuments();
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const sessoesHoje = await Sessao.countDocuments({
      data: { $gte: hoje, $lt: amanha }
    });
    
    // Calculate monthly revenue
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    const pagamentosMes = await Pagamento.find({
      createdAt: { $gte: inicioMes, $lte: fimMes },
      status: 'aprovado'
    });
    
    const faturamentoMes = pagamentosMes.reduce((total, pag) => total + pag.valor, 0);
    
    // Get recent sessions
    const sessoesRecentes = await Sessao.find()
      .populate('usuario', 'nome email')
      .populate('terapeuta', 'nome especialidade')
      .sort({ data: -1 })
      .limit(10);
      
    res.json({
      usuariosTotal,
      terapeutasTotal,
      sessoesHoje,
      faturamentoMes,
      sessoesRecentes
    });
  } catch (error) {
    logger.error('Erro ao obter estatísticas do dashboard', { error: error.message });
    res.status(500).json({ erro: 'Erro ao obter estatísticas' });
  }
};

// Função auxiliar para obter dados por período (semana, mês, etc.)
async function getPeriodData(periodType, startDate) {
  let periodFormat;
  let groupId;
  
  switch (periodType) {
    case 'week':
      periodFormat = { day: 'numeric', month: 'short' };
      groupId = { 
        day: { $dayOfMonth: "$data" }, 
        month: { $month: "$data" },
        year: { $year: "$data" }
      };
      break;
    case 'month':
      periodFormat = { day: 'numeric', month: 'short' };
      groupId = { 
        day: { $dayOfMonth: "$data" }, 
        month: { $month: "$data" },
        year: { $year: "$data" }
      };
      break;
    case 'quarter':
      periodFormat = { month: 'short' };
      groupId = { month: { $month: "$data" }, year: { $year: "$data" } };
      break;
    case 'year':
      periodFormat = { month: 'short' };
      groupId = { month: { $month: "$data" }, year: { $year: "$data" } };
      break;
    default:
      periodFormat = { day: 'numeric', month: 'short' };
      groupId = { 
        day: { $dayOfMonth: "$data" }, 
        month: { $month: "$data" },
        year: { $year: "$data" }
      };
  }
  
  const sessoes = await Sessao.aggregate([
    {
      $match: {
        data: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: groupId,
        confirmed: { 
          $sum: { $cond: [{ $eq: ["$status", "confirmado"] }, 1, 0] } 
        },
        pending: { 
          $sum: { $cond: [{ $eq: ["$status", "pendente"] }, 1, 0] } 
        },
        cancelled: { 
          $sum: { $cond: [{ $eq: ["$status", "cancelado"] }, 1, 0] } 
        }
      }
    },
    {
      $sort: { 
        "_id.year": 1, 
        "_id.month": 1, 
        "_id.day": 1 
      }
    }
  ]);
  
  // Formatar dados para retorno
  return sessoes.map(s => {
    let date;
    
    if (s._id.day) {
      date = new Date(s._id.year, s._id.month - 1, s._id.day);
    } else {
      date = new Date(s._id.year, s._id.month - 1, 1);
    }
    
    return {
      period: date.toLocaleDateString('pt-BR', periodFormat),
      confirmed: s.confirmed,
      pending: s.pending,
      cancelled: s.cancelled
    };
  });
}

// Função para calcular taxa de retenção mensal
async function calculateRetentionRate(periodType) {
  // Este é um cálculo simplificado de retenção
  // Para um cálculo mais preciso, seria necessário analisar cohorts
  
  const now = new Date();
  let months;
  
  switch (periodType) {
    case 'week':
      months = 2; // 2 meses para visualização semanal
      break;
    case 'month':
      months = 6; // Últimos 6 meses
      break;
    case 'quarter':
      months = 12; // Último ano
      break;
    case 'year':
      months = 24; // Últimos 2 anos
      break;
    default:
      months = 6;
  }
  
  const results = [];
  
  for (let i = 0; i < months; i++) {
    const endOfPeriod = new Date(now);
    endOfPeriod.setMonth(now.getMonth() - i);
    endOfPeriod.setDate(0); // Último dia do mês
    
    const startOfPeriod = new Date(endOfPeriod);
    startOfPeriod.setDate(1); // Primeiro dia do mês
    
    // Usuários que fizeram pelo menos uma sessão no período
    const usersWithSessions = await Sessao.distinct('usuario', {
      data: { $gte: startOfPeriod, $lte: endOfPeriod }
    });
    
    // Usuários que voltaram no mês seguinte
    const nextPeriodStart = new Date(endOfPeriod);
    nextPeriodStart.setDate(endOfPeriod.getDate() + 1);
    
    const nextPeriodEnd = new Date(nextPeriodStart);
    nextPeriodEnd.setMonth(nextPeriodStart.getMonth() + 1);
    
    const returningUsers = await Sessao.distinct('usuario', {
      usuario: { $in: usersWithSessions },
      data: { $gte: nextPeriodStart, $lte: nextPeriodEnd }
    });
    
    const retentionRate = usersWithSessions.length > 0
      ? (returningUsers.length / usersWithSessions.length * 100).toFixed(2)
      : 0;
    
    results.push({
      period: startOfPeriod.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      rate: parseFloat(retentionRate)
    });
  }
  
  return results.reverse(); // Do mais antigo para o mais recente
}

// Função para obter receita mensal dos últimos 12 meses
async function getMonthlyRevenue() {
  const months = 12;
  const results = [];
  
  for (let i = 0; i < months; i++) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() - i);
    endDate.setDate(0); // Último dia do mês
    
    const startDate = new Date(endDate);
    startDate.setDate(1); // Primeiro dia do mês
    
    const monthlyPayments = await Pagamento.find({
      status: 'aprovado',
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    const revenue = monthlyPayments.reduce((sum, p) => sum + p.valor, 0);
    
    results.push({
      month: startDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      revenue
    });
  }
  
  return results.reverse(); // Do mais antigo para o mais recente
}