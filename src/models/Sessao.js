import mongoose from 'mongoose';

const sessaoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  terapeuta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terapeuta',
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmado', 'cancelado'],
    default: 'pendente'
  },
  observacoes: {
    type: String
  },
  avaliado: {
    type: Boolean,
    default: false
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

const Sessao = mongoose.model('Sessao', sessaoSchema);

export default Sessao;
