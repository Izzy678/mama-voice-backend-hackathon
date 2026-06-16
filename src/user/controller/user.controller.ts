import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Patch,
    UseGuards,
} from '@nestjs/common';
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
import {
    UpdateProfileRequestDto,
    UserProfileDto,
} from '../dto/user.swagger.dto';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import { updateProfileValidator } from '../validation/user.validation';
import type { UpdateProfileBody } from '../dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiOkResponse({ type: UserProfileDto })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User not found' })
    getProfile(@TokenDataDecorator() token: Token) {
        return this.userService.getUserProfile(token.userId);
    }

    @Patch('profile')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Complete user profile onboarding' })
    @ApiBody({ type: UpdateProfileRequestDto })
    @ApiOkResponse({ type: UserProfileDto })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async updateProfile(
        @Body(new JoiObjectValidationPipe(updateProfileValidator)) body: UpdateProfileBody,
        @TokenDataDecorator() token: Token,
    ) {
        const { targetDate, ...profile } = body;
        const updatedUser = await this.userService.update({
            id: token.userId,
            ...profile,
            targetDate: new Date(targetDate),
            profileCompleted: true,
        });
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }

        const { password, refreshToken, ...user } = updatedUser;
        return user;
    }
}
