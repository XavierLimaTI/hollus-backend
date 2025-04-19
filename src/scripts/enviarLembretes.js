import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sessao from '../models/Sessao.js';
import User from '../models/User.js';
import Terapeuta from '../models/Terapeuta.js';
import { enviarEmailLembreteSessao } from '../utils/email.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("🚀 Conectado ao MongoDB Atlas com sucesso!");
    enviarLembretes();
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  });

async function enviarLembretes() {
  try {
    const agora = new Date();
    const amanha = new Date(agora);
    amanha.setDate(amanha.getDate() + 1);
    
    // Find sessions happening in the next 24 hours
    const sessoesProximas = await Sessao.find({
      data: { $gte: agora, $lte: amanha },
      status: 'confirmado'
    });
    
    console.log(`Encontradas ${sessoesProximas.length} sessões para enviar lembretes.`);
    
    for (const sessao of sessoesProximas) {
      const usuario = await User.findById(sessao.usuario);
      const terapeuta = await Terapeuta.findById(sessao.terapeuta);
      
      if (usuario && terapeuta) {
        await enviarEmailLembreteSessao(usuario.email, sessao, terapeuta);
        console.log(`Lembrete enviado para ${usuario.email} sobre sessão com ${terapeuta.nome}`);
      }
    }
    
    console.log("✅ Processo de envio de lembretes concluído!");
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao enviar lembretes:", error);
    mongoose.disconnect();
    process.exit(1);
  }
}