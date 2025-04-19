import logger from '../utils/logger.js';

export const getPromocoes = async (req, res) => {
  try {
    // Mock data for now
    const promocoes = [
      {
        _id: '1',
        titulo: 'Sessão Dupla de Reiki',
        descricao: 'Agende duas sessões de Reiki e ganhe 20% de desconto na segunda sessão.',
        desconto: 20,
        validade: new Date('2025-06-30')
      },
      {
        _id: '2',
        titulo: 'Pacote Relaxamento Total',
        descricao: 'Massagem terapêutica + Aromaterapia com 15% de desconto no pacote.',
        desconto: 15,
        validade: new Date('2025-05-15')
      },
      {
        _id: '3',
        titulo: 'Primeira Consulta',
        descricao: 'Desconto especial de 10% para novos clientes em qualquer terapia.',
        desconto: 10,
        validade: new Date('2025-12-31')
      }
    ];
    
    res.json(promocoes);
  } catch (error) {
    logger.error('Erro ao buscar promoções', { error: error.message });
    res.status(500).json({ erro: 'Erro ao buscar promoções' });
  }
};