import { Controller, Get, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import type { Token } from '../../auth/dto/auth.dto';
import { DashboardService } from '../service/dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get personalized dashboard data' })
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', example: 'Amina' },
                statusText: { type: 'string', example: 'You are 28 weeks pregnant' },
                currentWeek: { type: 'number', example: 28 },
                daysToNextVaccine: { type: 'number', nullable: true, example: 14 },
                nextVaccineName: { type: 'string', nullable: true, example: 'Penta 1, OPV 1, PCV 1 & Rotavirus 1' },
            },
        },
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    getDashboard(@TokenDataDecorator() token: Token) {
        return this.dashboardService.getDashboard(token.userId);
    }
}
