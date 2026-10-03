const { Router } = require('express');
const servicesController = require('../controllers/services.controller');
const { validate, rejectIdInBody } = require('../middlewares/validation.middleware');
const { createServiceSchema, updateServiceSchema } = require('../validators/services.validator');
const { servicesQuerySchema } = require('../validators/query.validator');

const router = Router();

router.get('/', validate(servicesQuerySchema, 'query'), servicesController.getServices);
router.get('/:sid', servicesController.getServiceById);
router.post('/', validate(createServiceSchema), servicesController.createService);
router.put('/:sid', rejectIdInBody, validate(updateServiceSchema), servicesController.updateService);
router.delete('/:sid', servicesController.deleteService);

module.exports = router;
