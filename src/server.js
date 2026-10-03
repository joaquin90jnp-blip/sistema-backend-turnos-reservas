const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { PORT, MONGO_URI } = require('./config/env.config');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Conectado a MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  app.set('socketio', io);

  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Servicios: http://localhost:${PORT}/api/services`);
    console.log(`Reservas: http://localhost:${PORT}/api/bookings`);
    console.log(`Vistas: http://localhost:${PORT}/views/services | /views/availability`);
    console.log('Socket.io activo');
  });
});
