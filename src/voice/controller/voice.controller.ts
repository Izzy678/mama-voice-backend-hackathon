import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../../utils/guard/auth.guard';
import { TokenDataDecorator } from '../../utils/decotator/token.decorator';
import type { Token } from '../../auth/dto/auth.dto';
import { JoiObjectValidationPipe } from '../../utils/pipes/validation.pipe';
import {
    assertValidVoiceAudioFile,
    voiceTextQueryValidator,
} from '../validation/voice.validation';
import { VOICE_AUDIO_MAX_BYTES } from '../constants/voice-audio.constants';
import type { UploadedVoiceFile } from '../dto/voice.dto';
import type { VoiceTextQueryBody } from '../dto/voice.dto';
import {
    VoiceQueryResponseDto,
    VoiceTextQueryRequestDto,
    VoiceTextQueryResponseDto,
} from '../dto/voice.swagger.dto';
import { VoiceService } from '../service/voice.service';

@ApiTags('Voice')
@ApiBearerAuth('access-token')
@Controller('voice')
export class VoiceController {
    constructor(private readonly voiceService: VoiceService) { }

    @Post('query')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('audio', {
            storage: memoryStorage(),
            limits: { fileSize: VOICE_AUDIO_MAX_BYTES },
        }),
    )
    @ApiOperation({
        summary:
            'Upload a voice recording and receive a native-language response with TTS audio URL',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['audio'],
            properties: {
                audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Voice recording (MP3, WAV, OGG, M4A, AAC, or WebM, max 5 MB)',
                },
            },
        },
    })
    @ApiOkResponse({ type: VoiceQueryResponseDto })
    @ApiBadRequestResponse({
        description:
            'Missing or invalid audio file, unclear speech, incomplete profile, or missing language',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    async query(
        @UploadedFile() file: UploadedVoiceFile | undefined,
        @TokenDataDecorator() token: Token,
    ) {

        assertValidVoiceAudioFile(file);
        const result = await this.voiceService.audioQuery(token.userId, file as UploadedVoiceFile);
        return result;
    }

    @Post('text-query')
    @UseGuards(AuthGuard)
    @ApiOperation({
        summary:
            'Submit a text health query and receive a native-language response with TTS audio URL',
    })
    @ApiBody({ type: VoiceTextQueryRequestDto })
    @ApiOkResponse({ type: VoiceTextQueryResponseDto })
    @ApiBadRequestResponse({
        description: 'Invalid request body, incomplete profile, or missing language',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    textQuery(
        @Body(new JoiObjectValidationPipe(voiceTextQueryValidator))
        body: VoiceTextQueryBody,
        @TokenDataDecorator() token: Token,
    ) {
        return this.voiceService.textQuery(token.userId, body.textQuery);
    }
}
