import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { envEnum } from 'src/utils/enum/env.enum';
import { RefreshToken, Token } from '../dto/auth.dto';
import { TokenStatusCodeEnum } from '../enum/auth.enum';

@Injectable()
export class TokenService {
  private readonly tokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly tokenExpiresIn: StringValue;
  private readonly refreshTokenExpiresIn: StringValue;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.tokenSecret = this.configService.get(envEnum.JWT_SECRET)!;
    this.refreshTokenSecret = this.configService.get(
      envEnum.JWT_REFRESH_SECRET,
    )!;
    this.tokenExpiresIn = this.configService.get<string>(
      envEnum.JWT_EXPIRES_IN,
    )! as StringValue;
    this.refreshTokenExpiresIn = this.configService.get<string>(
      envEnum.JWT_REFRESH_EXPIRES_IN,
    )! as StringValue;
  }

  verifyPasswordResetToken(token: string): RefreshToken {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.tokenSecret,
      }) as unknown as RefreshToken;
      return decodedToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Reset password link has expired. Kindly request for a new reset link',
        );
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  generatePasswordResetToken(user: string): string {
    const token = this.jwtService.sign(
      { user },
      {
        secret: this.tokenSecret,
        expiresIn: '15m',
      },
    );
    return token;
  }

  generateAuthorizationToken(data: Token) {
    const token = this.jwtService.sign(data, {
      secret: this.tokenSecret,
      expiresIn: this.tokenExpiresIn,
    });
    return token;
  }

  generatePreRegistrationToken(user: string) {
    const token = this.jwtService.sign(
      { user },
      {
        secret: this.tokenSecret,
        expiresIn: '15m',
      },
    );
    return token;
  }

  generateRefreshToken(data: RefreshToken): string {
    const refreshToken = this.jwtService.sign(data, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiresIn,
    });
    return refreshToken;
  }

  verifyAuthorizationToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.tokenSecret,
      }) as unknown as Token;
      return {
        token: decodedToken,
        code: TokenStatusCodeEnum.VALID,
        message: 'Valid Token',
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          token: null,
          code: TokenStatusCodeEnum.EXPIRED,
          message: 'Token Expired',
        };
      } else {
        return {
          token: null,
          code: TokenStatusCodeEnum.INVALID,
          message: 'Invalid Token',
        };
      }
    }
  }

  verifyRefreshToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.refreshTokenSecret,
      }) as unknown as RefreshToken;
      return {
        token: decodedToken,
        code: TokenStatusCodeEnum.VALID,
        message: 'Valid Token',
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return {
          token: null,
          code: TokenStatusCodeEnum.EXPIRED,
          message: 'Token Expired',
        };
      } else {
        return {
          token: null,
          code: TokenStatusCodeEnum.INVALID,
          message: 'Invalid Token',
        };
      }
    }
  }
}
