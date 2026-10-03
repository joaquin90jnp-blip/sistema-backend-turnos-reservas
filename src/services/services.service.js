const servicesRepository = require('../repositories/services.repository');
const mongoose = require('mongoose');

/**
 * Service — reglas de negocio, sin req/res ni acceso directo a DB.
 */

function _validateServiceFields(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate || data.hasOwnProperty('name')) {
    if (typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('name es obligatorio y debe ser un string no vacío');
    }
  }
  if (!isUpdate || data.hasOwnProperty('description')) {
    if (typeof data.description !== 'string' || data.description.trim() === '') {
      errors.push('description es obligatorio y debe ser un string no vacío');
    }
  }
  if (!isUpdate || data.hasOwnProperty('duration')) {
    if (typeof data.duration !== 'number' || isNaN(data.duration) || data.duration <= 0) {
      errors.push('duration es obligatorio y debe ser un número mayor a 0 (minutos)');
    }
  }
  if (!isUpdate || data.hasOwnProperty('price')) {
    if (typeof data.price !== 'number' || isNaN(data.price) || data.price < 0) {
      errors.push('price es obligatorio y debe ser un número mayor o igual a 0');
    }
  }
  if (!isUpdate || data.hasOwnProperty('category')) {
    if (typeof data.category !== 'string' || data.category.trim() === '') {
      errors.push('category es obligatorio y debe ser un string no vacío');
    }
  }
  if (!isUpdate || data.hasOwnProperty('available')) {
    if (typeof data.available !== 'boolean') {
      errors.push('available es obligatorio y debe ser un boolean');
    }
  }

  return errors;
}

function _validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error(`Id ${id} no es un ObjectId válido`);
    err.status = 400;
    throw err;
  }
}

const getServices = async () => {
  return await servicesRepository.getAll();
};

const getServicesPaginated = async (query = {}) => {
  const {
    category,
    available,
    page = 1,
    limit = 10,
    sortBy,
    order = 'asc'
  } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    const err = new Error('page debe ser un número entero mayor a 0');
    err.status = 400;
    throw err;
  }
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    const err = new Error('limit debe ser entre 1 y 100');
    err.status = 400;
    throw err;
  }

  const filter = {};
  if (category) filter.category = category;
  if (available !== undefined && available !== '') {
    if (available === 'true') filter.available = true;
    else if (available === 'false') filter.available = false;
    else {
      const err = new Error('available debe ser true o false');
      err.status = 400;
      throw err;
    }
  }

  const sort = {};
  if (sortBy) {
    const allowed = ['name', 'price', 'duration', 'category', 'createdAt', 'updatedAt'];
    if (!allowed.includes(sortBy)) {
      const err = new Error(`sortBy debe ser uno de: ${allowed.join(', ')}`);
      err.status = 400;
      throw err;
    }
    if (!['asc', 'desc'].includes(order)) {
      const err = new Error('order debe ser asc o desc');
      err.status = 400;
      throw err;
    }
    sort[sortBy] = order === 'desc' ? -1 : 1;
  }

  const skip = (pageNum - 1) * limitNum;

  const { services, total } = await servicesRepository.getPaginated({
    filter,
    sort,
    skip,
    limit: limitNum
  });

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    services,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    hasPrevPage: pageNum > 1,
    hasNextPage: pageNum < totalPages
  };
};

const getServiceById = async (sid) => {
  _validateObjectId(sid);
  return await servicesRepository.getById(sid);
};

const createService = async (serviceData) => {
  const { _id, id, ...cleanData } = serviceData;

  const errors = _validateServiceFields(cleanData, false);
  if (errors.length > 0) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  const newService = {
    name: cleanData.name.trim(),
    description: cleanData.description.trim(),
    duration: cleanData.duration,
    price: cleanData.price,
    category: cleanData.category.trim(),
    available: cleanData.available
  };

  return await servicesRepository.create(newService);
};

const updateService = async (sid, updates) => {
  _validateObjectId(sid);

  if (updates.hasOwnProperty('id') || updates.hasOwnProperty('_id')) {
    const err = new Error('No se puede modificar el id del servicio');
    err.status = 400;
    throw err;
  }

  const errors = _validateServiceFields(updates, true);
  if (errors.length > 0) {
    const err = new Error(errors.join('; '));
    err.status = 400;
    throw err;
  }

  if (Object.keys(updates).length === 0) {
    const err = new Error('No se enviaron campos para actualizar');
    err.status = 400;
    throw err;
  }

  const existing = await servicesRepository.getById(sid);
  if (!existing) {
    const err = new Error(`Servicio con id ${sid} no encontrado`);
    err.status = 404;
    throw err;
  }

  const toUpdate = { ...updates };
  if (toUpdate.name) toUpdate.name = String(toUpdate.name).trim();
  if (toUpdate.description) toUpdate.description = String(toUpdate.description).trim();
  if (toUpdate.category) toUpdate.category = String(toUpdate.category).trim();

  return await servicesRepository.update(sid, toUpdate);
};

const deleteService = async (sid) => {
  _validateObjectId(sid);
  const existing = await servicesRepository.getById(sid);
  if (!existing) {
    const err = new Error(`Servicio con id ${sid} no encontrado`);
    err.status = 404;
    throw err;
  }
  return await servicesRepository.delete(sid);
};

module.exports = {
  getServices,
  getServicesPaginated,
  getServiceById,
  createService,
  updateService,
  deleteService
};
