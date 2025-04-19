import mongoose from 'mongoose';

const promocaoSchema = new mongoose.Schema({
  terapeuta: { type: mongoose.Schema.Types.ObjectId, ref: 'Terapeuta', required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  desconto: { type: Number, required: true },
  validade: { type: Date, required: true },
}, {
  timestamps: true
});

const Promocao = mongoose.model('Promocao', promocaoSchema);
export default Promocao;