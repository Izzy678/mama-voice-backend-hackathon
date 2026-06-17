import Joi from 'joi';

export const aiQueryValidator = Joi.object({
  textQuery: Joi.string()
    .trim()
    .min(3)
    .max(1000)
    .required()
    .messages({
      'string.min': 'textQuery must be at least 3 characters',
      'string.max': 'textQuery must not exceed 1000 characters',
      'any.required': 'textQuery is required',
    }),
});
