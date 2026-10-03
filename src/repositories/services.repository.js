const ServicesDAO = require('../dao/services.dao');

const servicesDAO = new ServicesDAO();

/**
 * Repository — delega al DAO, sin reglas de negocio.
 */
class ServicesRepository {
  async getAll() {
    return await servicesDAO.getAll();
  }

  async getById(id) {
    return await servicesDAO.getById(id);
  }

  async create(serviceData) {
    return await servicesDAO.create(serviceData);
  }

  async update(id, newData) {
    return await servicesDAO.update(id, newData);
  }

  async delete(id) {
    return await servicesDAO.delete(id);
  }

  async getPaginated({ filter, sort, skip, limit }) {
    return await servicesDAO.getPaginated({ filter, sort, skip, limit });
  }
}

module.exports = new ServicesRepository();
