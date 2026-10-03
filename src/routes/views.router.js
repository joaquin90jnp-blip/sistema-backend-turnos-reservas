const { Router } = require('express');
const viewsController = require('../controllers/views.controller');

const router = Router();

router.get('/services', viewsController.renderServices);
router.get('/availability', viewsController.renderAvailability);
router.get('/bookings', viewsController.renderAvailability);

module.exports = router;
