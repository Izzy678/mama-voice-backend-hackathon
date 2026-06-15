import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { DeviceService } from '../../device/service/device.service';
import { LoginRequestContext } from '../../device/dto/device.dto';
import { EmailService } from '../../email/service/email.service';
import {
  otpEmailHtml,
} from '../../email/templates/email.templates';
import { LoginAuditService } from '../../login-audit/service/login-audit.service';
import { OtpService } from '../../otp/service/otp.service';
import { OTP_EXPIRY_MINUTES_VALUE } from '../../otp/utils/otp.util';
import { AccountStatusEnum } from '../../user/enum/user.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import {
  LoginBody,
  RefreshToken,
  RefreshTokenBody,
  RegisterBody,
  ResendOtpBody,
  Token,
  VerifyEmailOtpBody,
} from '../dto/auth.dto';
import { TokenStatusCodeEnum } from '../enum/auth.enum';
import { TokenService } from './token.service';
import { envEnum } from '../../utils/enum/env.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly deviceService: DeviceService,
    private readonly loginAuditService: LoginAuditService,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
    private readonly configService: ConfigService,
  ) { }

  private get isDev(): boolean {
    return this.configService.get<string>(envEnum.NODE_ENV) === 'development';
  }

  async register(body: RegisterBody) {
    const existingUser = await this.userService.find({ email: body.email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await this.userService.create({
      email: body.email,
      password: hashedPassword,
      accountStatus: AccountStatusEnum.Active,
      emailVerified: false,
      profileCompleted: false,
    });

    const { otp, code } = await this.issueAndSendOtp(user.id, user.email);

    return {
      email: user.email,
      otpId: otp.id,
      ...(this.isDev && { devOtp: code }),
    };
  }

  async verifyEmailOtp(body: VerifyEmailOtpBody) {
    const userId = await this.otpService.verifyOtp(
      body.otpId,
      body.otp,
    );

    const user = await this.userService.find({ id: userId });
    if (!user) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verifiedUser = await this.userService.update({
      id: user.id,
      emailVerified: true,
    });

    const { accessToken, refreshToken, user: profile } = await this.buildAuthResponse(verifiedUser!);
    return { token: accessToken, refreshToken, user: profile, isExistingUser: false };
  }

  async resendOtp(body: ResendOtpBody) {
    const user = await this.userService.find({ email: body.email });
    if (!user) {
      throw new BadRequestException('No account found for this email');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const { otp, code } = await this.issueAndSendOtp(user.id, user.email);

    return {
      email: user.email,
      otpId: otp.id,
      ...(this.isDev && { devOtp: code }),
    };
  }

  async login(body: LoginBody, context: LoginRequestContext) {
    const user = await this.userService.find({ email: body.email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (body.deviceId && body.platform) {
      await this.deviceService.registerOrUpdateOnLogin({
        userId: user.id,
        deviceId: body.deviceId,
        platform: body.platform,
        deviceModel: body.deviceModel,
        pushNotificationToken: body.pushNotificationToken,
      });
    }

    const loggedInAt = new Date();
    await this.loginAuditService.recordLoginWithRiskAssessment({
      userId: user.id,
      deviceId: body.deviceId ?? null,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      country: context.country,
      city: context.city,
      timestamp: loggedInAt,
    });

    await this.userService.update({
      id: user.id,
      lastLoginAt: loggedInAt,
    });

    const { accessToken, refreshToken, user: profile } = await this.buildAuthResponse(user);
    return { token: accessToken, refreshToken, user: profile, isExistingUser: true };
  }


  async refresh(body: RefreshTokenBody) {
    const tokenData = this.tokenService.verifyRefreshToken(body.refreshToken);

    if (tokenData.code !== TokenStatusCodeEnum.VALID || !tokenData.token) {
      if (tokenData.code === TokenStatusCodeEnum.EXPIRED) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.find({ id: tokenData.token.userId });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.refreshToken || user.refreshToken !== body.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.buildAuthResponse(user);
    return { token: accessToken, refreshToken: newRefreshToken };
  }

  private async issueAndSendOtp(userId: string, email: string) {
    const { otp, code } = await this.otpService.createOtp(userId);

    try {
      await this.emailService.sendEmail({
        to: email,
        subject: 'Your MamaVoice verification code',
        html: otpEmailHtml(code, OTP_EXPIRY_MINUTES_VALUE),
      });
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error);
      if (!this.isDev) throw error;
    }

    return { otp, code };
  }

   async buildAuthResponse(user: UserEntity) {
    const tokenPayload: Token = {
      userId: user.id,
      accountStatus: user?.accountStatus,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
      language: user?.language,
      state: user?.state,
      lga: user?.lga,
      motherStage: user?.motherStage,
      emailVerified: user?.emailVerified,
    };

    const refreshTokenPayload: RefreshToken = {
      userId: user.id,
    };

    const refreshToken =
      this.tokenService.generateRefreshToken(refreshTokenPayload);

    await this.userService.update({ id: user.id, refreshToken });

    return {
      accessToken: this.tokenService.generateAuthorizationToken(tokenPayload),
      refreshToken,
      user: await this.userService.getUserProfile(user.id),
    };
  }
}
