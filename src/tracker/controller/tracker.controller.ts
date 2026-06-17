import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Token } from '../../auth/dto/auth.dto';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import type { LogHealthBody } from '../dto/tracker.dto';
import {
  HealthHistoryResponseDto,
  HealthLogItemDto,
  LogHealthRequestDto,
} from '../dto/tracker.swagger.dto';
import { TrackerService } from '../service/tracker.service';
import { logHealthValidator } from '../validation/tracker.validation';

@ApiTags('Health Tracker')
@ApiBearerAuth('access-token')
@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get('history')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get chronological health log history' })
  @ApiOkResponse({ type: HealthHistoryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  getHistory(@TokenDataDecorator() token: Token) {
    return this.trackerService.getHistory(token.userId);
  }

  @Post('log')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Log or update a health entry for a given date' })
  @ApiBody({ type: LogHealthRequestDto })
  @ApiOkResponse({ type: HealthLogItemDto })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  logHealth(
    @Body(new JoiObjectValidationPipe(logHealthValidator)) body: LogHealthBody,
    @TokenDataDecorator() token: Token,
  ) {
    return this.trackerService.logHealth(token.userId, body);
  }
}
