import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import type { Token } from '../../auth/dto/auth.dto';
import { UserService } from '../service/user.service';
import { MotherStageEnum } from '../enum/user.enum';
import type { SetProfileBody } from '../dto/user.dto';
import { setProfileValidator } from '../validation/user.validation';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserOnboardingController {
    constructor(private readonly userService: UserService) { }

    @Post('profile')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Set user profile after registration' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string' },
                type: { type: 'string', enum: ['PREGNANT', 'NEW_MOM'] },
                targetDate: { type: 'string', format: 'date', example: '2025-09-01' },
            },
            required: ['firstName', 'type', 'targetDate'],
        },
    })
    @ApiOkResponse({ schema: { type: 'object', properties: { status: { type: 'string', example: 'SUCCESS' } } } })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    async setProfile(
        @Body(new JoiObjectValidationPipe(setProfileValidator)) body: SetProfileBody,
        @TokenDataDecorator() token: Token,
    ) {
        const motherStage =
            body.type === 'PREGNANT' ? MotherStageEnum.Pregnant : MotherStageEnum.Postpartum;

        await this.userService.update({
            id: token.userId,
            firstName: body.firstName,
            motherStage,
            targetDate: new Date(body.targetDate),
            profileCompleted: true,
        });

        return { status: 'SUCCESS' };
    }
}
