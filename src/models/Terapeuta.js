import mongoose from 'mongoose';

const terapeutaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  especialidade: { type: String },
  atendimentoOnline: { type: Boolean, default: false },
  localizacao: { type: String }, // Novo campo
  horariosDisponiveis: [{ type: String }], // Novo campo
  descricao: { type: String }, // Novo campo
  coordenadas: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
}, {
  timestamps: true
});

const Terapeuta = mongoose.model('Terapeuta', terapeutaSchema);
export default Terapeuta;
