import Joi from 'joi';
import { DevicePlatformEnum } from '../../device/enum/device.enum';

const passwordSchema = Joi.string()
  .min(8)
  .custom((value, helpers) => {
    if (!/[a-z]/.test(value)) {
      return helpers.error('password.lowercase');
    }
    if (!/[A-Z]/.test(value)) {
      return helpers.error('password.uppercase');
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return helpers.error('password.specialCharacter');
    }
    return value;
  })
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'password.lowercase':
      'Password must contain at least one lowercase letter',
    'password.uppercase':
      'Password must contain at least one uppercase letter',
    'password.specialCharacter':
      'Password must contain at least one special character',
  });

export const registerValidator = Joi.object({
  email: Joi.string().email().required(),
  password: passwordSchema.required(),
});
export const loginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().optional(),
  platform: Joi.string()
    .valid(DevicePlatformEnum.Ios, DevicePlatformEnum.Android)
    .optional(),
  deviceModel: Joi.string().optional(),
  pushNotificationToken: Joi.string().optional(),
});

export const refreshValidator = Joi.object({
  refreshToken: Joi.string().required(),
});

export const verifyEmailOtpValidator = Joi.object({
  otpId: Joi.string().uuid().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must contain only numbers',
  }),
});

export const resendOtpValidator = Joi.object({
  email: Joi.string().email().required(),
});
