const servicesService = require('../services/services.service');

/**
 * Controller — req -> service -> res + io.emit. Sin lógica de negocio.
 */

const getServices = async (req, res) => {
  try {
    const result = await servicesService.getServicesPaginated(req.query);
    res.json({
      status: 'success',
      payload: result.services,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage
    });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await servicesService.getServiceById(sid);
    if (!service) {
      return res.status(404).json({ status: 'error', error: `Servicio con id ${sid} no encontrado` });
    }
    res.json({ status: 'success', payload: service });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const newService = await servicesService.createService(req.body);
    const io = req.app.get('socketio');
    if (io) io.emit('serviceCreated', newService);
    res.status(201).json({ status: 'success', payload: newService });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { sid } = req.params;
    const updated = await servicesService.updateService(sid, req.body);
    const io = req.app.get('socketio');
    if (io) io.emit('serviceUpdated', updated);
    res.json({ status: 'success', payload: updated });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { sid } = req.params;
    const deleted = await servicesService.deleteService(sid);
    const io = req.app.get('socketio');
    if (io) io.emit('serviceDeleted', { id: sid, deleted });
    res.json({ status: 'success', payload: deleted, message: `Servicio con id ${sid} eliminado` });
  } catch (error) {
    res.status(error.status || 500).json({ status: 'error', error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
