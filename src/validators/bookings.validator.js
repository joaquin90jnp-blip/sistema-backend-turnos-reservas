const { z } = require('zod');

const objectIdRegex = /^[a-f\d]{24}$/i;

const createBookingSchema = z.object({
  clientName: z.string({ required_error: 'clientName es obligatorio' }).min(1, 'clientName no puede estar vacío').trim(),
  clientEmail: z.string({ required_error: 'clientEmail es obligatorio' }).email('clientEmail debe ser un email válido').trim(),
  date: z.string({ required_error: 'date es obligatoria' }).regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD'),
  time: z.string({ required_error: 'time es obligatoria' }).regex(/^\d{2}:\d{2}$/, 'time debe tener formato HH:MM'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'], { errorMap: () => ({ message: 'status debe ser pending, confirmed, cancelled o completed' }) }).optional().default('pending')
}).strict();

const updateBookingSchema = z.object({
  clientName: z.string().min(1, 'clientName no puede estar vacío').trim().optional(),
  clientEmail: z.string().email('clientEmail debe ser un email válido').trim().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD').optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time debe tener formato HH:MM').optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed'], { errorMap: () => ({ message: 'status debe ser pending, confirmed, cancelled o completed' }) }).optional()
}).strict().refine(data => Object.keys(data).length > 0, {
  message: 'Debe enviar al menos un campo para actualizar'
});

const addServiceToBookingSchema = z.object({
  bid: z.string({ required_error: 'bid es obligatorio' }).regex(objectIdRegex, 'bid debe ser un ObjectId válido'),
  sid: z.string({ required_error: 'sid es obligatorio' }).regex(objectIdRegex, 'sid debe ser un ObjectId válido')
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  addServiceToBookingSchema
};
