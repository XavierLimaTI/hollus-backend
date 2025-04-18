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
  observacoes: {
    type: String
  }
}, {
  timestamps: true
});

const Sessao = mongoose.model('Sessao', sessaoSchema);
export default Sessao;
