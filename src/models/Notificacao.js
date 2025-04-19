import mongoose from 'mongoose';

const notificacaoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  titulo: {
    type: String,
    required: true
  },
  mensagem: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['sessao', 'pagamento', 'avaliacao', 'sistema', 'promocao'],
    default: 'sistema'
  },
  lida: {
    type: Boolean,
    default: false
  },
  dados: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 dias em segundos
  }
});

const Notificacao = mongoose.model('Notificacao', notificacaoSchema);
export default Notificacao;