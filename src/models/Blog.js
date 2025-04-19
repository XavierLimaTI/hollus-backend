import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  conteudo: {
    type: String,
    required: true
  },
  resumo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  autor: {
    type: String,
    required: true
  },
  imagem: {
    type: String,
    default: '/images/blog/default.jpg'
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;