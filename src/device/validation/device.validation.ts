import Joi from 'joi';

export const updatePushTokenValidator = Joi.object({
  deviceId: Joi.string().required(),
  pushNotificationToken: Joi.string().required(),
});
