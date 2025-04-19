import mongoose from 'mongoose';

const pagamentoSchema = new mongoose.Schema({
  sessao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessao',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'aprovado', 'recusado', 'estornado'],
    default: 'pendente'
  },
  metodo: {
    type: String,
    enum: ['credit_card', 'pix', 'boleto'],
    required: true
  },
  comprovante: {
    type: String // URL para comprovante ou ID de transação
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

const Pagamento = mongoose.model('Pagamento', pagamentoSchema);
export default Pagamento;