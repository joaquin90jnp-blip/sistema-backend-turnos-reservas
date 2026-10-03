const servicesService = require('../services/services.service');
const bookingsService = require('../services/bookings.service');

/**
 * Views Controller — usa las mismas capas que la API. Sin lógica de negocio ni acceso a DB.
 */

const renderServices = async (req, res) => {
  try {
    const services = await servicesService.getServices();
    res.render('services', {
      title: 'Servicios - Turnos y Reservas',
      services
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

const renderAvailability = async (req, res) => {
  try {
    const services = await servicesService.getServices();
    const bookings = await bookingsService.getBookings();
    res.render('availability', {
      title: 'Disponibilidad y Reservas',
      services,
      bookings
    });
  } catch (error) {
    res.status(500).render('error', { error: error.message });
  }
};

module.exports = {
  renderServices,
  renderAvailability
};
