import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String, required: true },
  autor: { type: String, required: true },
  dataPublicacao: { type: Date, default: Date.now },
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;