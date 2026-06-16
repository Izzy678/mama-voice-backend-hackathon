import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnumsResponseDto } from '../dto/generic-api.swagger.dto';
import { GenericApiService } from '../service/generic-api.service';

@ApiTags('Generic')
@Controller('generic')
export class GenericApiController {
  constructor(private readonly genericApiService: GenericApiService) {}

  @Get('enums')
  @ApiOperation({ summary: 'Get dropdown options for app enums' })
  @ApiOkResponse({ type: EnumsResponseDto })
  getEnums() {
    return this.genericApiService.getEnums();
  }
}
