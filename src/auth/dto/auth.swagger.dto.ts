import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevicePlatformEnum } from '../../device/enum/device.enum';
import { OtpPurposeEnum } from '../../otp/enum/otp.enum';
import { UserProfileDto } from '../../user/dto/user.swagger.dto';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export class RegisterRequestDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Password1#', minLength: 8 })
  password: string;
}

export class VerifyEmailOtpRequestDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The otpId returned by /auth/register or /auth/resend-otp',
  })
  otpId: string;

  @ApiProperty({ example: '482910', description: '6-digit OTP sent to email' })
  otp: string;
}

export class ResendOtpRequestDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  email: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  email: string;

  @ApiProperty({ example: 'Password1#' })
  password: string;

  @ApiPropertyOptional({ example: 'device-uuid-123' })
  deviceId?: string;

  @ApiPropertyOptional({ enum: DevicePlatformEnum, example: DevicePlatformEnum.Android })
  platform?: DevicePlatformEnum;

  @ApiPropertyOptional({ example: 'Samsung Galaxy S24' })
  deviceModel?: string;

  @ApiPropertyOptional({ example: 'fcm-token-xyz' })
  pushNotificationToken?: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({ description: 'The refreshToken received from login or verify-email' })
  refreshToken: string;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export class RegisterResponseDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  email: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Pass this as otpId when calling /auth/verify-email',
  })
  otpId: string;
}

export class OtpSentResponseDto {
  @ApiProperty({ example: 'amina@gmail.com' })
  email: string;

  @ApiProperty({
    example: '661f9511-f30c-52e5-b827-557766551111',
    description: 'Pass this as otpId when calling /auth/verify-email',
  })
  otpId: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token — use as Bearer token for protected routes',
  })
  token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Use this to get a new access token via /auth/refresh',
  })
  refreshToken: string;

  @ApiProperty({ example: false, description: 'Always false for a newly verified account' })
  isExistingUser: boolean;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token — use as Bearer token for protected routes',
  })
  token: string;

  @ApiProperty({ example: true, description: 'Always true for login — use to skip onboarding' })
  isExistingUser: boolean;
}

export class RefreshResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'New JWT access token',
  })
  token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'New refresh token — replace the old one in storage',
  })
  refreshToken: string;
}

// ─── Legacy (kept for PATCH /users/me) ───────────────────────────────────────

export class OtpPublicDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: OtpPurposeEnum, example: OtpPurposeEnum.EmailVerification })
  purpose: OtpPurposeEnum;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class AuthUserDto extends UserProfileDto {}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
