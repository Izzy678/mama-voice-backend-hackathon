import Joi from 'joi';
import { LanguageEnum, MotherStageEnum } from '../enum/user.enum';

const nameSchema = Joi.string()
  .trim()
  .min(2)
  .max(50)
  .pattern(/^[\p{L}\s'-]+$/u)
  .messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 50 characters',
    'string.pattern.base': 'Name contains invalid characters',
  });

export const setProfileValidator = Joi.object({
  firstName: nameSchema.required(),
  type: Joi.string().valid('PREGNANT', 'NEW_MOM').required(),
  targetDate: Joi.string().isoDate().required(),
});

export const updateProfileValidator = Joi.object({
  firstName: nameSchema.required(),
  lastName: nameSchema.required(),
  phoneNumber: Joi.string().required(),
  language: Joi.string()
    .valid(
      ...Object.values(LanguageEnum),
    )
    .required(),
  state: Joi.string().trim().min(2).max(100).required(),
  lga: Joi.string().trim().min(2).max(100).required(),
  motherStage: Joi.string()
    .valid(MotherStageEnum.Pregnant, MotherStageEnum.Postpartum)
    .required(),
}).min(1);

