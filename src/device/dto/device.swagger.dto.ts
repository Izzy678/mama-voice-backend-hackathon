import { ApiProperty } from '@nestjs/swagger';

export class UpdatePushTokenRequestDto {
  @ApiProperty({ example: 'device-uuid-123' })
  deviceId: string;

  @ApiProperty({ example: 'fcm-or-apns-token' })
  pushNotificationToken: string;
}

export class DeviceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty({ enum: ['ios', 'android'] })
  platform: string;

  @ApiProperty({ nullable: true })
  deviceModel: string | null;

  @ApiProperty({ nullable: true })
  pushNotificationToken: string | null;

  @ApiProperty()
  lastSeenAt: Date;
}
