import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import type { Token } from '../../auth/dto/auth.dto';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import { aiQueryValidator } from '../validation/ai.validation';
import type { AiQueryBody } from '../dto/ai.dto';
import { AiQueryRequestDto, AiQueryResponseDto } from '../dto/ai.swagger.dto';
import { AiService } from '../service/ai.service';

@ApiTags('AI')
@ApiBearerAuth('access-token')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Submit a text health query to the AI assistant' })
  @ApiBody({ type: AiQueryRequestDto })
  @ApiOkResponse({ type: AiQueryResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid request body or incomplete user profile',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  query(
    @Body(new JoiObjectValidationPipe(aiQueryValidator)) body: AiQueryBody,
    @TokenDataDecorator() token: Token,
  ) {
    return this.aiService.query(token.userId, body.textQuery);
  }
}
