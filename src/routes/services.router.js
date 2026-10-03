const { Router } = require('express');
const servicesController = require('../controllers/services.controller');
const { validate, rejectIdInBody } = require('../middlewares/validation.middleware');
const { createServiceSchema, updateServiceSchema } = require('../validators/services.validator');

const router = Router();

router.get('/', servicesController.getServices);
router.get('/:sid', servicesController.getServiceById);
router.post('/', validate(createServiceSchema), servicesController.createService);
router.put('/:sid', rejectIdInBody, validate(updateServiceSchema), servicesController.updateService);
router.delete('/:sid', servicesController.deleteService);

module.exports = router;
