import Joi from 'joi';
import { LanguageEnum, MotherStageEnum } from '../enum/user.enum';
import { ALL_LGAS, NIGERIA_STATE_LGAS, NIGERIAN_STATES } from '../constants/nigeria.constants';

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
  state: Joi.string().valid(...NIGERIAN_STATES).required(),
  lga: Joi.string()
    .valid(...ALL_LGAS)
    .custom((value, helpers) => {
      const state: string | undefined = (helpers.state.ancestors[0] as Record<string, unknown>)?.state as string | undefined;
      if (state && NIGERIA_STATE_LGAS[state] && !NIGERIA_STATE_LGAS[state].includes(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({ 'any.invalid': 'LGA does not belong to the selected state' }),
  motherStage: Joi.string()
    .valid(MotherStageEnum.Pregnant, MotherStageEnum.Postpartum)
    .required(),
}).min(1);

