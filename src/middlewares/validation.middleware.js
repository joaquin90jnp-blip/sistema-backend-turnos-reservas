/**
 * validate(schema, source) — middleware Zod.
 * Valida req[source] antes de tocar DB. Responde 400 con mensaje claro.
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    req[source] = schema.parse(req[source]);
    next();
  } catch (e) {
    const details = e.errors
      ? e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ')
      : e.message;
    return res.status(400).json({ status: 'error', error: details });
  }
};

/**
 * Rechaza intentos de modificar el id por body en PUT.
 */
const rejectIdInBody = (req, res, next) => {
  if (req.body && (req.body.id !== undefined || req.body._id !== undefined)) {
    return res.status(400).json({ status: 'error', error: 'No se puede modificar el id' });
  }
  next();
};

module.exports = {
  validate,
  rejectIdInBody
};
