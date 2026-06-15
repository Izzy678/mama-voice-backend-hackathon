import { randomInt } from 'crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;

export function generateOtpCode(): string {
  const max = 10 ** OTP_LENGTH;
  const min = 10 ** (OTP_LENGTH - 1);
  return randomInt(min, max).toString();
}

export function getOtpExpiryDate(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export const OTP_EXPIRY_MINUTES_VALUE = OTP_EXPIRY_MINUTES;
