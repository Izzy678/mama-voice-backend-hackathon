import { OtpPurposeEnum } from '../enum/otp.enum';

export interface OtpPublic {
  id: string;
  purpose: OtpPurposeEnum;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreatedOtpResult {
  otp: OtpPublic;
  code: string;
}
