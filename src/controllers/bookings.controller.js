const bookingsService = require('../services/bookings.service');

/**
 * Controller — req -> service -> res + io.emit.
 */

const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingsService.createBooking(req.body);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingCreated', newBooking);
    res.status(201).json({ status: 'success', payload: newBooking });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingsService.getBookings();
    res.json({ status: 'success', payload: bookings, total: bookings.length });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { bid } = req.params;
    const booking = await bookingsService.getBookingById(bid);
    if (!booking) {
      return res.status(404).json({ status: 'error', error: `Reserva con id ${bid} no encontrada` });
    }
    res.json({ status: 'success', payload: booking });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { bid } = req.params;
    const updated = await bookingsService.updateBooking(bid, req.body);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingUpdated', updated);
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { bid } = req.params;
    const deleted = await bookingsService.deleteBooking(bid);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingDeleted', { id: bid, deleted });
    res.json({ status: 'success', payload: deleted, message: `Reserva con id ${bid} eliminada` });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const addServiceToBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const updatedBooking = await bookingsService.addServiceToBooking(bid, sid);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingUpdated', updatedBooking);
    res.json({ status: 'success', payload: updatedBooking });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const updateServiceQuantity = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const { quantity } = req.body;
    const updatedBooking = await bookingsService.updateServiceQuantity(bid, sid, quantity);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingUpdated', updatedBooking);
    res.json({ status: 'success', payload: updatedBooking });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const removeServiceFromBooking = async (req, res) => {
  try {
    const { bid, sid } = req.params;
    const updatedBooking = await bookingsService.removeServiceFromBooking(bid, sid);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingUpdated', updatedBooking);
    res.json({ status: 'success', payload: updatedBooking, message: `Servicio con id ${sid} eliminado de la reserva ${bid}` });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const clearBookingServices = async (req, res) => {
  try {
    const { bid } = req.params;
    const updatedBooking = await bookingsService.clearBookingServices(bid);
    const io = req.app.get('socketio');
    if (io) io.emit('bookingUpdated', updatedBooking);
    res.json({ status: 'success', payload: updatedBooking, message: `Servicios de la reserva ${bid} vaciados` });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  addServiceToBooking,
  updateServiceQuantity,
  removeServiceFromBooking,
  clearBookingServices
};
