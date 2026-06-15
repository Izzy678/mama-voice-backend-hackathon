import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevicePlatformEnum } from '../../device/enum/device.enum';
import { OtpPurposeEnum } from '../../otp/enum/otp.enum';
import { UserProfileDto } from '../../user/dto/user.swagger.dto';

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Password1!', minLength: 8 })
  password: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Password1!' })
  password: string;

  @ApiProperty({ example: 'device-uuid-123' })
  deviceId: string;

  @ApiProperty({ enum: DevicePlatformEnum, example: DevicePlatformEnum.Ios })
  platform: DevicePlatformEnum;

  @ApiPropertyOptional({ example: 'iPhone 15 Pro' })
  deviceModel?: string;

  @ApiPropertyOptional({ example: 'fcm-or-apns-token' })
  pushNotificationToken?: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty()
  refreshToken: string;
}

export class AuthUserDto extends UserProfileDto {}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token (Bearer). Replace stored token after profile update.',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token. Replace stored token after profile update.',
  })
  refreshToken: string;

  @ApiProperty({ type: AuthUserDto, description: 'Updated user profile' })
  user: AuthUserDto;
}

export class OtpPublicDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({
    enum: OtpPurposeEnum,
    example: OtpPurposeEnum.EmailVerification,
  })
  purpose: OtpPurposeEnum;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: 'Registration successful. Please verify your email with the OTP sent.',
  })
  message: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ type: OtpPublicDto })
  otp: OtpPublicDto;
}

export class VerifyEmailOtpRequestDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  otpId: string;

  @ApiProperty({ example: '123456' })
  otp: string;
}

export class ResendOtpRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;
}

export class OtpSentResponseDto {
  @ApiProperty({ example: 'A new verification OTP has been sent to your email' })
  message: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ type: OtpPublicDto })
  otp: OtpPublicDto;
}
