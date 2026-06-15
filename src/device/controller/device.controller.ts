import {
  Body,
  Controller,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import { TokenDataDecorator } from 'src/utils/decotator/token.decorator';
import type { Token } from 'src/auth/dto/auth.dto';
import type { UpdatePushTokenBody } from '../dto/device.dto';
import {
  DeviceResponseDto,
  UpdatePushTokenRequestDto,
} from '../dto/device.swagger.dto';
import { DeviceService } from '../service/device.service';
import { updatePushTokenValidator } from '../validation/device.validation';

@ApiTags('Devices')
@ApiBearerAuth('access-token')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Patch('push-notification-token')
  @ApiOperation({ summary: 'Update push notification token for a device' })
  @ApiBody({ type: UpdatePushTokenRequestDto })
  @ApiOkResponse({ type: DeviceResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiNotFoundResponse({ description: 'Device not found' })
  async updatePushNotificationToken(
    @Body(new JoiObjectValidationPipe(updatePushTokenValidator))
    body: UpdatePushTokenBody,
    @TokenDataDecorator() token: Token | undefined,
  ) {
    if (!token?.userId) {
      throw new UnauthorizedException('Authentication required');
    }

    const device = await this.deviceService.updatePushNotificationToken(
      token.userId,
      body.deviceId,
      body.pushNotificationToken,
    );

    return {
      id: device.id,
      deviceId: device.deviceId,
      platform: device.platform,
      deviceModel: device.deviceModel,
      pushNotificationToken: device.pushNotificationToken,
      lastSeenAt: device.lastSeenAt,
    };
  }
}
