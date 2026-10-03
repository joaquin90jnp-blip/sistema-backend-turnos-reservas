const { z } = require('zod');

const createServiceSchema = z.object({
  name: z.string({ required_error: 'name es obligatorio' }).min(1, 'name no puede estar vacío').trim(),
  description: z.string({ required_error: 'description es obligatoria' }).min(1, 'description no puede estar vacía').trim(),
  duration: z.number({ required_error: 'duration es obligatoria', invalid_type_error: 'duration debe ser un número' }).int().positive('duration debe ser mayor a 0'),
  price: z.number({ required_error: 'price es obligatorio', invalid_type_error: 'price debe ser un número' }).min(0, 'price debe ser mayor o igual a 0'),
  category: z.string({ required_error: 'category es obligatoria' }).min(1, 'category no puede estar vacía').trim(),
  available: z.boolean({ required_error: 'available es obligatorio', invalid_type_error: 'available debe ser boolean' })
}).strict();

const updateServiceSchema = z.object({
  name: z.string().min(1, 'name no puede estar vacío').trim().optional(),
  description: z.string().min(1, 'description no puede estar vacía').trim().optional(),
  duration: z.number().int().positive('duration debe ser mayor a 0').optional(),
  price: z.number().min(0, 'price debe ser mayor o igual a 0').optional(),
  category: z.string().min(1, 'category no puede estar vacía').trim().optional(),
  available: z.boolean().optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});

module.exports = {
  createServiceSchema,
  updateServiceSchema
};
