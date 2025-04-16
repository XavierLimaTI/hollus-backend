// Importações dos pacotes
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Carregar variáveis do arquivo .env
dotenv.config();

// Criar o app Express
const app = express();

// Definir a porta do servidor (padrão: 5000)
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permite acesso do frontend
app.use(express.json()); // Permite receber JSON nas requisições

import userRoutes from './routes/userRoutes.js';
import terapeutaRoutes from './routes/terapeutaRoutes.js';
app.use('/api', terapeutaRoutes);
// Ativa rotas de terapeuta com prefixo /api
// Importa as rotas de usuário e terapeuta



app.use('/api', userRoutes); // Ativa rotas de usuário com prefixo /api


// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("🚀 Conectado ao MongoDB Atlas com sucesso!");
})
.catch((err) => {
  console.error("❌ Erro ao conectar ao MongoDB:", err.message);
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('✅ API HOLLUS está rodando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
