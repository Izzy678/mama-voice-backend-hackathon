import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { FoodsListResponseDto } from '../dto/food.swagger.dto';
import { FoodService } from '../service/food.service';

@ApiTags('Foods')
@ApiBearerAuth('access-token')
@Controller('foods')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get local foods directory' })
  @ApiQuery({
    name: 'stage',
    required: false,
    enum: ['PREGNANT', 'POSTPARTUM'],
    description: 'Filter foods by mother stage. Omit to return all foods.',
  })
  @ApiOkResponse({ type: FoodsListResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  getFoods(@Query('stage') stage?: string) {
    const validStage =
      stage === 'PREGNANT' || stage === 'POSTPARTUM' ? stage : undefined;

    return this.foodService.findAll(validStage);
  }
}
