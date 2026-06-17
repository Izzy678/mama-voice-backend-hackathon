import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
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
import { SetProfileRequestDto, SetProfileResponseDto } from '../dto/user.swagger.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserOnboardingController {
    constructor(private readonly userService: UserService) { }

    @Post('profile')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Set user profile after registration' })
    @ApiBody({ type: SetProfileRequestDto })
    @ApiCreatedResponse({ type: SetProfileResponseDto })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    async setProfile(
        @Body(new JoiObjectValidationPipe(setProfileValidator)) body: SetProfileBody,
        @TokenDataDecorator() token: Token,
    ) {
        const motherStage =
            body.type === 'PREGNANT' ? MotherStageEnum.Pregnant : MotherStageEnum.NewMom;

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


