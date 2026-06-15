import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import type {
  LoginBody,
  RefreshTokenBody,
  RegisterBody,
  ResendOtpBody,
  VerifyEmailOtpBody,
} from '../dto/auth.dto';
import {
  LoginRequestDto,
  LoginResponseDto,
  OtpSentResponseDto,
  RefreshTokenRequestDto,
  RefreshResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResendOtpRequestDto,
  VerifyEmailOtpRequestDto,
  VerifyEmailResponseDto,
} from '../dto/auth.swagger.dto';
import { AuthService } from '../service/auth.service';
import {
  loginValidator,
  refreshValidator,
  registerValidator,
  resendOtpValidator,
  verifyEmailOtpValidator,
} from '../validation/auth.validation';
import { getClientIp, getGeoFromRequest, getUserAgent } from '../../utils/request/request.util';
import { LoginRequestContext } from '../../device/dto/device.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @ApiConflictResponse({ description: 'Email already registered' })
  register(
    @Body(new JoiObjectValidationPipe(registerValidator)) body: RegisterBody,
  ) {
    return this.authService.register(body);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with OTP — returns token on success' })
  @ApiBody({ type: VerifyEmailOtpRequestDto })
  @ApiCreatedResponse({ type: VerifyEmailResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid or expired OTP' })
  verifyEmailOtp(
    @Body(new JoiObjectValidationPipe(verifyEmailOtpValidator))
    body: VerifyEmailOtpBody,
  ) {
    return this.authService.verifyEmailOtp(body);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend email verification OTP' })
  @ApiBody({ type: ResendOtpRequestDto })
  @ApiOkResponse({ type: OtpSentResponseDto })
  @ApiBadRequestResponse({ description: 'Email already verified or not found' })
  resendOtp(
    @Body(new JoiObjectValidationPipe(resendOtpValidator)) body: ResendOtpBody,
  ) {
    return this.authService.resendOtp(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  login(
    @Body(new JoiObjectValidationPipe(loginValidator)) body: LoginBody,
    @Req() req: Request,
  ) {
    return this.authService.login(body, this.buildLoginContext(req));
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiCreatedResponse({ type: RefreshResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  refresh(
    @Body(new JoiObjectValidationPipe(refreshValidator)) body: RefreshTokenBody,
  ) {
    return this.authService.refresh(body);
  }

  private buildLoginContext(req: Request): LoginRequestContext {
    const geo = getGeoFromRequest(req);
    return {
      ipAddress: getClientIp(req),
      userAgent: getUserAgent(req),
      country: geo.country,
      city: geo.city,
    };
  }
}
