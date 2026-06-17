import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Token } from '../../auth/dto/auth.dto';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import type { LogVaccineBody } from '../dto/vaccine.dto';
import {
  LogVaccineRequestDto,
  LogVaccineResponseDto,
  VaccinesListResponseDto,
} from '../dto/vaccine.swagger.dto';
import { VaccineService } from '../service/vaccine.service';
import { logVaccineValidator } from '../validation/vaccine.validation';

@ApiTags('Vaccines')
@ApiBearerAuth('access-token')
@Controller('vaccines')
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get vaccination checklist for the user\'s baby' })
  @ApiOkResponse({ type: VaccinesListResponseDto })
  @ApiBadRequestResponse({ description: 'Profile is incomplete' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  getVaccines(@TokenDataDecorator() token: Token) {
    return this.vaccineService.getVaccines(token.userId);
  }

  @Post('log')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Mark a vaccine as administered' })
  @ApiBody({ type: LogVaccineRequestDto })
  @ApiOkResponse({ type: LogVaccineResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Vaccine ID not found in schedule' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  logVaccine(
    @Body(new JoiObjectValidationPipe(logVaccineValidator)) body: LogVaccineBody,
    @TokenDataDecorator() token: Token,
  ) {
    return this.vaccineService.logVaccine(token.userId, body);
  }
}
