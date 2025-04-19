import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { apiLimiter, loginLimiter } from './middleware/rateLimitMiddleware.js';
import { inicializarSocketIO } from './services/websocketService.js';
import connectToDatabase from './config/database.js';

// Carregar variáveis do arquivo .env
dotenv.config();

// Importações das rotas
import userRoutes from './routes/userRoutes.js';
import terapeutaRoutes from './routes/terapeutaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sessaoRoutes from './routes/sessaoRoutes.js';
import promocaoRoutes from './routes/promocaoRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import avaliacaoRoutes from './routes/avaliacaoRoutes.js';
import notificacaoRoutes from './routes/notificacaoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pagamentoRoutes from './routes/pagamentoRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import promocoesRoutes from './routes/promocoesRoutes.js';

// Criar o app Express
const app = express();
const server = http.createServer(app);

// Inicializar Socket.IO
inicializarSocketIO(server);

// Definir a porta do servidor (padrão: 5000)
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Conexão com o banco de dados
connectToDatabase();

// Adicionar rate limiting global para API
app.use('/api/', apiLimiter);

// Registrar rotas
app.use('/api/users', userRoutes);
app.use('/api/terapeutas', terapeutaRoutes);
app.use('/api/auth/login', loginLimiter); // Rate limit específico para login
app.use('/api/auth', authRoutes);
app.use('/api/sessoes', sessaoRoutes);
app.use('/api/promocoes', promocaoRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/notificacoes', notificacaoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/promocoes', promocoesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('✅ API HOLLUS está rodando!');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("🚀 Conectado ao MongoDB Atlas com sucesso!");
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar com o MongoDB Atlas:", err);
  });

// Iniciar o servidor HTTP
server.listen(PORT, () => {
  console.log(`🌐 Servidor rodando na porta ${PORT}`);
});

export default app;