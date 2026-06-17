import Joi from 'joi';

export const logVaccineValidator = Joi.object({
  vaccineId: Joi.string().required(),
  administeredDate: Joi.string().isoDate().required(),
  sideEffects: Joi.string().optional(),
});
