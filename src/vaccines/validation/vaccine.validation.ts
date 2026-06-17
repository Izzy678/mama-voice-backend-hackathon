import Joi from 'joi';

export const logVaccineValidator = Joi.object({
  vaccineId: Joi.string().required(),
  administeredDate: Joi.string().isoDate().required(),
  vaccineName: Joi.string().optional(),
  isCompleted: Joi.boolean().optional(),
  sideEffects: Joi.string().optional(),
});
