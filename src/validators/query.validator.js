const { z } = require('zod');

const servicesQuerySchema = z.object({
  category: z.string().min(1).trim().optional(),
  available: z.enum(['true', 'false'], { errorMap: () => ({ message: 'available debe ser true o false' }) }).optional(),
  page: z.coerce.number().int().min(1, 'page debe ser mayor a 0').optional().default(1),
  limit: z.coerce.number().int().min(1, 'limit debe ser mayor a 0').max(100, 'limit debe ser como máximo 100').optional().default(10),
  sortBy: z.enum(['name', 'price', 'duration', 'category', 'createdAt', 'updatedAt'], { errorMap: () => ({ message: 'sortBy inválido' }) }).optional(),
  order: z.enum(['asc', 'desc'], { errorMap: () => ({ message: 'order debe ser asc o desc' }) }).optional().default('asc')
});

module.exports = {
  servicesQuerySchema
};
