const bookingsRepository = require('../repositories/bookings.repository');
const servicesRepository = require('../repositories/services.repository');
const mongoose = require('mongoose');

/**
 * Service — reglas de negocio de reservas, sin req/res.
 * Si el mismo servicio se agrega dos veces, incrementa quantity.
 */

function _validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Id ${id} no es un ObjectId válido`);
    err.status = 400;
    throw err;
  }
}

function _validateBookingFields(data) {
  const errors = [];

  if (typeof data.clientName !== 'string' || data.clientName.trim() === '') {
    errors.push('clientName es obligatorio y debe ser un string no vacío');
  }
  if (typeof data.clientEmail !== 'string' || data.clientEmail.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
    errors.push('clientEmail es obligatorio y debe ser un email válido');
  }
  if (typeof data.date !== 'string' || data.date.trim() === '' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push('date es obligatorio y debe tener formato YYYY-MM-DD');
  }
  if (typeof data.time !== 'string' || data.time.trim() === '' || !/^\d{2}:\d{2}$/.test(data.time)) {
    errors.push('time es obligatorio y debe tener formato HH:MM');
  }
  if (data.status !== undefined && !['pending', 'confirmed', 'cancelled', 'completed'].includes(data.status)) {
    errors.push('status debe ser pending, confirmed, cancelled o completed');
  }

  return errors;
}

const createBooking = async (bookingData) => {
  const { _id, id, services, ...rest } = bookingData;

  const dataToValidate = {
    ...rest,
    status: rest.status || 'pending'
  };

  const errors = _validateBookingFields(dataToValidate);
  if (errors.length > 0) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  const newBooking = {
    clientName: rest.clientName.trim(),
    clientEmail: rest.clientEmail.trim(),
    date: rest.date,
    time: rest.time,
    status: rest.status ? String(rest.status).trim() : 'pending',
    services: []
  };

  return await bookingsRepository.create(newBooking);
};

const getBookingById = async (bid) => {
  _validateObjectId(bid);
  return await bookingsRepository.getById(bid);
};

const getBookings = async () => {
  return await bookingsRepository.getAll();
};

const updateBooking = async (bid, updates) => {
  _validateObjectId(bid);

  if (updates.hasOwnProperty('id') || updates.hasOwnProperty('_id')) {
    const err = new Error('No se puede modificar el id de la reserva');
    err.status = 400;
    throw err;
  }
  if (updates.hasOwnProperty('services')) {
    const err = new Error('Para agregar servicios use POST /api/bookings/:bid/services/:sid');
    err.status = 400;
    throw err;
  }
  if (Object.keys(updates).length === 0) {
    const err = new Error('No se enviaron campos para actualizar');
    err.status = 400;
    throw err;
  }

  const allowed = ['clientName', 'clientEmail', 'date', 'time', 'status'];
  const invalid = Object.keys(updates).filter((k) => !allowed.includes(k));
  if (invalid.length > 0) {
    const err = new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const existing = await bookingsRepository.getById(bid);
  if (!existing) {
    const err = new Error(`Reserva con id ${bid} no encontrada`);
    err.status = 404;
    throw err;
  }

  const merged = {
    clientName: updates.clientName !== undefined ? updates.clientName : existing.clientName,
    clientEmail: updates.clientEmail !== undefined ? updates.clientEmail : existing.clientEmail,
    date: updates.date !== undefined ? updates.date : existing.date,
    time: updates.time !== undefined ? updates.time : existing.time,
    status: updates.status !== undefined ? updates.status : existing.status
  };

  const errors = _validateBookingFields(merged);
  if (errors.length > 0) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  const toUpdate = {};
  if (updates.clientName !== undefined) toUpdate.clientName = String(updates.clientName).trim();
  if (updates.clientEmail !== undefined) toUpdate.clientEmail = String(updates.clientEmail).trim();
  if (updates.date !== undefined) toUpdate.date = updates.date;
  if (updates.time !== undefined) toUpdate.time = updates.time;
  if (updates.status !== undefined) toUpdate.status = String(updates.status).trim();

  return await bookingsRepository.update(bid, toUpdate);
};

const deleteBooking = async (bid) => {
  _validateObjectId(bid);
  const existing = await bookingsRepository.getById(bid);
  if (!existing) {
    const err = new Error(`Reserva con id ${bid} no encontrada`);
    err.status = 404;
    throw err;
  }
  return await bookingsRepository.delete(bid);
};

const addServiceToBooking = async (bid, sid) => {
  _validateObjectId(bid);
  _validateObjectId(sid);

  const booking = await bookingsRepository.getById(bid);
  if (!booking) {
    const err = new Error(`Reserva con id ${bid} no encontrada`);
    err.status = 404;
    throw err;
  }

  const service = await servicesRepository.getById(sid);
  if (!service) {
    const err = new Error(`Servicio con id ${sid} no encontrado`);
    err.status = 404;
    throw err;
  }

  if (!Array.isArray(booking.services)) {
    booking.services = [];
  }

  const existing = booking.services.find((item) => {
    const serviceId = item.service?._id ? item.service._id.toString() : item.service.toString();
    return serviceId === sid.toString();
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    booking.services.push({ service: sid, quantity: 1 });
  }

  const servicesToSave = booking.services.map((item) => ({
    service: item.service?._id ? item.service._id : item.service,
    quantity: item.quantity
  }));

  const updatedData = {
    ...booking,
    services: servicesToSave
  };

  delete updatedData._id;
  delete updatedData.__v;
  delete updatedData.createdAt;
  delete updatedData.updatedAt;

  return await bookingsRepository.update(bid, updatedData);
};

module.exports = {
  createBooking,
  getBookingById,
  getBookings,
  updateBooking,
  deleteBooking,
  addServiceToBooking
};
