import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const getTeamMembers = async (req, res) => {
  try {
    // Mock data for team members since we don't have a model yet
    const teamMembers = [
      {
        id: '1',
        name: 'Ana Silva',
        role: 'Fundadora e CEO',
        bio: 'Terapeuta holística com mais de 15 anos de experiência, Ana fundou a HOLLUS com o objetivo de promover bem-estar e saúde integral.',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        socialMedia: {
          instagram: 'anasilva',
          linkedin: 'anasilva'
        }
      },
      {
        id: '2',
        name: 'Carlos Mendes',
        role: 'Diretor de Operações',
        bio: 'Especialista em gestão de negócios com foco em saúde e bem-estar, Carlos ajuda a HOLLUS a expandir e melhorar seus serviços.',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        socialMedia: {
          instagram: 'carlosmendes',
          linkedin: 'carlosmendes'
        }
      },
      {
        id: '3',
        name: 'Mariana Costa',
        role: 'Coordenadora de Terapeutas',
        bio: 'Com formação em psicologia e terapias complementares, Mariana seleciona e treina nossos terapeutas para garantir excelência.',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        socialMedia: {
          instagram: 'marianacosta',
          linkedin: 'marianacosta'
        }
      }
    ];

    // Add this line - it was missing!
    res.json(teamMembers);
    
  } catch (error) {
    logger.error('Erro ao buscar membros da equipe', { error: error.message });
    res.status(500).json({ erro: 'Erro ao buscar membros da equipe' });
  }
};