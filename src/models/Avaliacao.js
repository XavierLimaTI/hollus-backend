import mongoose from 'mongoose';

const avaliacaoSchema = new mongoose.Schema({
  terapeuta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Terapeuta',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nota: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    trim: true
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

// Índice composto para evitar avaliações duplicadas
avaliacaoSchema.index({ terapeuta: 1, usuario: 1 }, { unique: true });

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema);

export default Avaliacao;