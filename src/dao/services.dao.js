const ServiceModel = require('../models/service.model');

/**
 * DAO — Data Access Object para services (MongoDB/Mongoose)
 * Solo acceso a datos, sin lógica de negocio ni validaciones.
 */
class ServicesDAO {
  async getAll() {
    return await ServiceModel.find().lean();
  }

  async getById(id) {
    return await ServiceModel.findById(id).lean();
  }

  async create(serviceData) {
    const created = await ServiceModel.create(serviceData);
    return created.toObject();
  }

  async update(id, newData) {
    return await ServiceModel.findByIdAndUpdate(id, newData, {
      new: true,
      runValidators: true
    }).lean();
  }

  async delete(id) {
    return await ServiceModel.findByIdAndDelete(id).lean();
  }

  async getPaginated({ filter = {}, sort = {}, skip = 0, limit = 10 }) {
    const total = await ServiceModel.countDocuments(filter);
    const services = await ServiceModel.find(filter).sort(sort).skip(skip).limit(limit).lean();
    return { services, total };
  }
}

module.exports = ServicesDAO;
