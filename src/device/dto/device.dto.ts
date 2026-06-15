import { DevicePlatformEnum } from '../enum/device.enum';

export interface UpdatePushTokenBody {
  deviceId: string;
  pushNotificationToken: string;
}

export interface LoginDeviceInfo {
  deviceId: string;
  platform: DevicePlatformEnum;
  deviceModel?: string | null;
  pushNotificationToken?: string | null;
}

export interface LoginRequestContext {
  ipAddress: string;
  userAgent: string | null;
  country: string | null;
  city: string | null;
}
