import mongoose from 'mongoose';

const terapeutaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  especialidade: { type: String, required: true },
  atendimentoOnline: { type: Boolean, default: true },
  criadoEm: { type: Date, default: Date.now }
});

const Terapeuta = mongoose.model('Terapeuta', terapeutaSchema);

export default Terapeuta;
