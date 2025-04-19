import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const inicializarSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado', { socketId: socket.id });

    socket.on('autenticar', (token) => {
      try {
        // Verificar token de autenticação
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) {
          // Associar socket ao usuário
          socket.join(`usuario:${decoded.id}`);
          console.log('Cliente autenticado', { socketId: socket.id, usuarioId: decoded.id });
        }
      } catch (error) {
        console.error('Erro na autenticação do socket', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado', { socketId: socket.id });
    });
  });

  console.log('Serviço de WebSockets inicializado');
  return io;
};

export const enviarNotificacao = (usuarioId, tipo, dados) => {
  if (!io) {
    console.warn('Tentativa de enviar notificação sem o socket.io inicializado');
    return;
  }

  io.to(`usuario:${usuarioId}`).emit('notificacao', {
    tipo,
    dados,
    timestamp: new Date()
  });

  console.log('Notificação enviada', { usuarioId, tipo });
};