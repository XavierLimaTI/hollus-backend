import Terapeuta from '../models/Terapeuta.js';
import Sessao from '../models/Sessao.js';      // Adicionar esta importação
import Avaliacao from '../models/Avaliacao.js'; // Adicionar esta importação
import Promocao from '../models/Promocao.js';   // Adicionar esta importação
import logger from '../utils/logger.js';        // Importar logger para melhor monitoramento

export const criarTerapeuta = async (req, res) => {
  const { nome, email, especialidade, atendimentoOnline, localizacao, horariosDisponiveis, descricao } = req.body;
  try {
    const existente = await Terapeuta.findOne({ email });
    if (existente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    const novo = await Terapeuta.create({ nome, email, especialidade, atendimentoOnline, localizacao, horariosDisponiveis, descricao });
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

export const buscarTerapeutasProximos = async (req, res) => {
  const { latitude, longitude, distancia } = req.query;

  try {
    const terapeutas = await Terapeuta.find({
      coordenadas: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], distancia / 6378.1], // Distância em km
        },
      },
    });

    res.json(terapeutas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar terapeutas próximos.' });
  }
};

export const obterEstatisticasTerapeuta = async (req, res) => {
  try {
    const terapeutaId = req.usuario._id;
    logger.info('Obtendo estatísticas para terapeuta', { terapeutaId });
    
    // Total de sessões
    const totalSessoes = await Sessao.countDocuments({ terapeuta: terapeutaId });
    
    // Sessões por status
    const sessoesConfirmadas = await Sessao.countDocuments({ 
      terapeuta: terapeutaId,
      status: 'confirmado'
    });
    const sessoesPendentes = await Sessao.countDocuments({ 
      terapeuta: terapeutaId,
      status: 'pendente'
    });
    const sessoesCanceladas = await Sessao.countDocuments({ 
      terapeuta: terapeutaId,
      status: 'cancelado'
    });
    
    // Clientes únicos atendidos
    const clientesUnicos = await Sessao.distinct('usuario', { 
      terapeuta: terapeutaId,
      status: 'confirmado'
    }).then(usuarios => usuarios.length);
    
    // Avaliação média
    const avaliacoes = await Avaliacao.find({ terapeuta: terapeutaId });
    const totalAvaliacoes = avaliacoes.length;
    const somaNotas = avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
    const avaliacaoMedia = totalAvaliacoes > 0 ? parseFloat((somaNotas / totalAvaliacoes).toFixed(1)) : 0;
    
    // Promoções ativas
    const promocoesAtivas = await Promocao.countDocuments({
      terapeuta: terapeutaId,
      validade: { $gt: new Date() }
    });
    
    const resultado = {
      totalSessoes,
      sessoesConfirmadas,
      sessoesPendentes,
      sessoesCanceladas,
      clientesUnicos,
      avaliacaoMedia,
      totalAvaliacoes,
      promocoesAtivas
    };
    
    logger.info('Estatísticas obtidas com sucesso', { terapeutaId });
    res.json(resultado);
  } catch (err) {
    logger.error('Erro ao obter estatísticas do terapeuta', { error: err.message, stack: err.stack });
    res.status(500).json({ erro: 'Erro ao obter estatísticas do terapeuta.' });
  }
};
