const BookingsDAO = require('../dao/bookings.dao');

const bookingsDAO = new BookingsDAO();

/**
 * Repository — delega al DAO, sin reglas de negocio.
 */
class BookingsRepository {
  async getById(id) {
    return await bookingsDAO.getById(id);
  }

  async getAll() {
    return await bookingsDAO.getAll();
  }

  async create(bookingData) {
    return await bookingsDAO.create(bookingData);
  }

  async update(id, newData) {
    return await bookingsDAO.update(id, newData);
  }

  async delete(id) {
    return await bookingsDAO.delete(id);
  }
}

module.exports = new BookingsRepository();
