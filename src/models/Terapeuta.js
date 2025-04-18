import mongoose from 'mongoose';

const terapeutaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  especialidade: { type: String },
  atendimentoOnline: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Terapeuta = mongoose.model('Terapeuta', terapeutaSchema);
export default Terapeuta;
