import {
  AccountStatusEnum,
  LanguageEnum,
  MotherStageEnum,
} from '../../user/enum/user.enum';
import { DevicePlatformEnum } from '../../device/enum/device.enum';

export interface Token {
  userId: string;
  accountStatus: AccountStatusEnum;
  email: string;
  firstName: string | null;
  lastName: string | null;
  language: LanguageEnum | null;
  state: string | null;
  lga: string | null;
  motherStage: MotherStageEnum | null;
  emailVerified: boolean;
}

export interface RefreshToken {
  userId: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
  deviceId?: string;
  platform?: DevicePlatformEnum;
  deviceModel?: string | null;
  pushNotificationToken?: string | null;
}

export interface RefreshTokenBody {
  refreshToken: string;
}

export interface VerifyEmailOtpBody {
  otpId: string;
  otp: string;
}

export interface ResendOtpBody {
  email: string;
}
