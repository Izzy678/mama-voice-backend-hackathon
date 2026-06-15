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
import { AuthResponseDto } from 'src/auth/dto/auth.swagger.dto';
import { AuthService } from 'src/auth/service/auth.service';
import type { Token } from 'src/auth/dto/auth.dto';
import { TokenDataDecorator } from 'src/utils/decotator/token.decorator';
import {
    UpdateProfileRequestDto,
    UserProfileDto,
} from '../dto/user.swagger.dto';
import { UserService } from '../service/user.service';
import { AuthGuard } from 'src/utils/guard/auth.guard';
import { JoiObjectValidationPipe } from 'src/utils/pipes/validation.pipe';
import { updateProfileValidator } from '../validation/user.validation';
import type { UpdateProfileBody } from '../dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Get('me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiOkResponse({ type: UserProfileDto })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User not found' })
    getProfile(@TokenDataDecorator() token: Token) {
        return this.userService.getUserProfile(token.userId);
    }

    @Patch('me')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Complete user profile onboarding' })
    @ApiBody({ type: UpdateProfileRequestDto })
    @ApiOkResponse({ type: AuthResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User not found' })
    async updateProfile(
        @Body(new JoiObjectValidationPipe(updateProfileValidator)) body: UpdateProfileBody,
        @TokenDataDecorator() token: Token,
    ) {
        const updatedUser = await this.userService.update({
            id: token.userId,
            ...body,
            profileCompleted: true,
        });
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return this.authService.buildAuthResponse(updatedUser);
    }
}
