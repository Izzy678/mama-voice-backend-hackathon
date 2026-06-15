import { DevicePlatformEnum } from '../enum/device.enum';

export interface RegisterDeviceInput {
  userId: string;
  deviceId: string;
  platform: DevicePlatformEnum;
  deviceModel?: string | null;
  pushNotificationToken?: string | null;
}
