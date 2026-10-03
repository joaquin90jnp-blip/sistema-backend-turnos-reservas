const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const servicesRouter = require('./routes/services.router');
const bookingsRouter = require('./routes/bookings.router');
const viewsRouter = require('./routes/views.router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    extname: '.handlebars'
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/views', viewsRouter);

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Sistema Backend de Turnos y Reservas - API + Handlebars + Socket.io',
    architecture: 'router → controller → service → repository → DAO → MongoDB',
    endpoints: {
      services: '/api/services',
      bookings: '/api/bookings',
      viewsServices: '/views/services',
      viewsAvailability: '/views/availability'
    }
  });
});

app.use((req, res) => {
  if (req.originalUrl.startsWith('/views')) {
    return res.status(404).render('error', { error: `Vista ${req.originalUrl} no encontrada` });
  }
  res.status(404).json({
    status: 'error',
    error: `Ruta ${req.originalUrl} no encontrada`
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  if (req.originalUrl.startsWith('/views')) {
    return res.status(status).render('error', { error: err.message || 'Error interno' });
  }
  res.status(status).json({
    status: 'error',
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
