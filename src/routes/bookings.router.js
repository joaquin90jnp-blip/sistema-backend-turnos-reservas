const { Router } = require('express');
const bookingsController = require('../controllers/bookings.controller');
const { validate, rejectIdInBody } = require('../middlewares/validation.middleware');
const { createBookingSchema, updateBookingSchema, addServiceToBookingSchema, bookingServiceParamsSchema, bookingIdParamsSchema, updateServiceQuantitySchema } = require('../validators/bookings.validator');

const router = Router();

router.get('/', bookingsController.getBookings);
router.post('/', validate(createBookingSchema), bookingsController.createBooking);
router.get('/:bid', bookingsController.getBookingById);
router.put('/:bid', rejectIdInBody, validate(updateBookingSchema), bookingsController.updateBooking);
router.delete('/:bid', bookingsController.deleteBooking);
router.post('/:bid/services/:sid', validate(addServiceToBookingSchema, 'params'), bookingsController.addServiceToBooking);
router.put('/:bid/services/:sid', validate(bookingServiceParamsSchema, 'params'), validate(updateServiceQuantitySchema), bookingsController.updateServiceQuantity);
router.delete('/:bid/services/:sid', validate(bookingServiceParamsSchema, 'params'), bookingsController.removeServiceFromBooking);
router.delete('/:bid/services', validate(bookingIdParamsSchema, 'params'), bookingsController.clearBookingServices);

module.exports = router;
