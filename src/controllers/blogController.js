import Blog from '../models/Blog.js';
import logger from '../utils/logger.js';

// Obter todas as postagens do blog
export const getPostagens = async (req, res) => {
  try {
    const postagens = await Blog.find()
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .select('titulo resumo autor imagem tags createdAt');
      
    res.json(postagens);
  } catch (error) {
    logger.error('Erro ao listar postagens do blog', { error: error.message });
    res.status(500).json({ erro: 'Erro ao listar postagens do blog.' });
  }
};

// Obter uma postagem específica
export const getPostagem = async (req, res) => {
  try {
    const postagem = await Blog.findById(req.params.id);
    
    if (!postagem) {
      return res.status(404).json({ erro: 'Postagem não encontrada.' });
    }
    
    res.json(postagem);
  } catch (error) {
    logger.error('Erro ao buscar postagem do blog', { error: error.message, id: req.params.id });
    res.status(500).json({ erro: 'Erro ao buscar postagem do blog.' });
  }
};

// Criar nova postagem
export const criarPostagem = async (req, res) => {
  try {
    const { titulo, conteudo, resumo, autor, imagem, tags } = req.body;
    
    const novaPostagem = await Blog.create({
      titulo,
      conteudo,
      resumo,
      autor,
      imagem,
      tags
    });
    
    logger.info('Nova postagem criada', { id: novaPostagem._id });
    res.status(201).json({ 
      mensagem: 'Postagem criada com sucesso!', 
      postagem: novaPostagem 
    });
  } catch (error) {
    logger.error('Erro ao criar postagem do blog', { error: error.message });
    res.status(500).json({ erro: 'Erro ao criar postagem do blog.' });
  }
};

// Atualizar postagem
export const atualizarPostagem = async (req, res) => {
  try {
    const { titulo, conteudo, resumo, imagem, tags } = req.body;
    
    const postagem = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        conteudo,
        resumo,
        imagem,
        tags,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!postagem) {
      return res.status(404).json({ erro: 'Postagem não encontrada.' });
    }
    
    logger.info('Postagem atualizada', { id: postagem._id });
    res.json({ 
      mensagem: 'Postagem atualizada com sucesso!', 
      postagem 
    });
  } catch (error) {
    logger.error('Erro ao atualizar postagem do blog', { error: error.message, id: req.params.id });
    res.status(500).json({ erro: 'Erro ao atualizar postagem do blog.' });
  }
};

// Deletar postagem
export const deletarPostagem = async (req, res) => {
  try {
    const postagem = await Blog.findByIdAndDelete(req.params.id);
    
    if (!postagem) {
      return res.status(404).json({ erro: 'Postagem não encontrada.' });
    }
    
    logger.info('Postagem deletada', { id: req.params.id });
    res.json({ mensagem: 'Postagem deletada com sucesso!' });
  } catch (error) {
    logger.error('Erro ao deletar postagem do blog', { error: error.message, id: req.params.id });
    res.status(500).json({ erro: 'Erro ao deletar postagem do blog.' });
  }
};