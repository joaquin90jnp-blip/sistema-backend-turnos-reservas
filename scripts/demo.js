/**
 * Demo sin Atlas: levanta Mongo en memoria, siembra datos de prueba
 * y arranca la app real (API + Handlebars + Socket.io) en PORT.
 * Uso: npm run demo
 * No requiere MONGO_URI ni credenciales.
 */
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

async function main() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('turnos-reservas-demo');
  process.env.MONGO_URI = uri;

  const { PORT } = require('../src/config/env.config');
  const app = require('../src/app');
  const servicesService = require('../src/services/services.service');
  const bookingsService = require('../src/services/bookings.service');

  await mongoose.connect(uri);
  console.log(`Demo conectada a Mongo en memoria`);

  const existing = await servicesService.getServices();
  if (existing.length === 0) {
    const s1 = await servicesService.createService({ name: 'Corte clásico', description: 'Corte + lavado', duration: 30, price: 5000, category: 'peluqueria', available: true });
    const s2 = await servicesService.createService({ name: 'Coloración', description: 'Color + nutrición', duration: 90, price: 12000, category: 'peluqueria', available: true });
    const s3 = await servicesService.createService({ name: 'Limpieza facial', description: 'Higiene profunda', duration: 60, price: 8000, category: 'estetica', available: false });
    const b1 = await bookingsService.createBooking({ clientName: 'Ana', clientEmail: 'ana@test.com', date: '2026-10-05', time: '10:00', status: 'confirmed' });
    await bookingsService.addServiceToBooking(b1._id.toString(), s1._id.toString());
    const b2 = await bookingsService.createBooking({ clientName: 'Bruno', clientEmail: 'bruno@test.com', date: '2026-10-06', time: '15:30', status: 'pending' });
    await bookingsService.addServiceToBooking(b2._id.toString(), s3._id.toString());
    console.log('Demo seed OK: 3 servicios, 2 reservas');
  }

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: '*' } });
  app.set('socketio', io);
  io.on('connection', (socket) => console.log(`Cliente conectado: ${socket.id}`));

  httpServer.listen(PORT, () => {
    console.log(`Demo lista en http://localhost:${PORT}`);
    console.log(`Vistas: http://localhost:${PORT}/views/services | /views/availability`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
