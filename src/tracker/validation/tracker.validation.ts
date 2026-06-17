import Joi from 'joi';

export const logHealthValidator = Joi.object({
  logDate: Joi.string().isoDate().required(),
  weightKg: Joi.number().positive().max(300).optional(),
  bloodPressure: Joi.string().max(20).optional(),
  nutritionNotes: Joi.string().max(1000).optional(),
  symptoms: Joi.string().max(1000).optional(),
});
