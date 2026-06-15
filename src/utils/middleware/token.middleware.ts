import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../../auth/service/token.service';
import { TokenStatusCodeEnum } from '../../auth/enum/auth.enum';
import { DeviceService } from '../../device/service/device.service';
import { AccountStatusEnum } from '../../user/enum/user.enum';
import { getDeviceIdFromRequest } from '../request/request.util';

@Injectable()
export class UserTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly tokenService: TokenService,
    private readonly deviceService: DeviceService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return next();
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    const tokenData = await this.tokenService.verifyAuthorizationToken(token);

    if (
      tokenData.code !== TokenStatusCodeEnum.VALID ||
      !tokenData.token
    ) {
      throw new BadRequestException('please provide a valid JWT token');
    }

    if (tokenData.token.accountStatus === AccountStatusEnum.Suspended)
      throw new BadRequestException(
        'sorry your account is suspended. Kindly contact admin for further assistance',
      );

    res.locals.tokenData = tokenData;

    const deviceId = getDeviceIdFromRequest(req);
    if (deviceId) {
      void this.deviceService
        .touchLastSeen(tokenData.token.userId, deviceId)
        .catch(() => undefined);
    }

    next();
  }
}
