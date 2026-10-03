const BookingModel = require('../models/booking.model');

/**
 * DAO — Data Access Object para bookings (MongoDB/Mongoose)
 * Solo acceso a datos. populate para devolver el detalle del servicio referenciado.
 */
class BookingsDAO {
  async getById(id) {
    return await BookingModel.findById(id).populate('services.service').lean();
  }

  async getAll() {
    return await BookingModel.find().populate('services.service').lean();
  }

  async create(bookingData) {
    const created = await BookingModel.create(bookingData);
    return created.toObject();
  }

  async update(id, newData) {
    return await BookingModel.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true
    })
      .populate('services.service')
      .lean();
  }

  async delete(id) {
    return await BookingModel.findByIdAndDelete(id).lean();
  }
}

module.exports = BookingsDAO;
