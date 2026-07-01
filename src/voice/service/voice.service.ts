import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AiService } from '../../ai/service/ai.service';
import { FileService } from '../../file/service/file.service';
import { UserService } from '../../user/service/user.service';
import { LanguageEnum } from '../../user/enum/user.enum';
import { VOICE_STT_MIN_CONFIDENCE } from '../constants/voice-audio.constants';
import { resolveEffectiveLanguage } from '../constants/resolve-detected-language';
import { SttService } from './stt.service';
import { TtsService } from './tts.service';
import type {
  UploadedVoiceFile,
  VoiceQueryResponse,
  VoiceTextQueryResponse,
} from '../dto/voice.dto';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly ttsService: TtsService,
    private readonly sttService: SttService,
  ) {}

  async audioQuery(
    userId: string,
    file: UploadedVoiceFile,
  ): Promise<VoiceQueryResponse> {
    const profileLanguage = await this.resolveUserLanguage(userId);

    const sttResult = await this.sttService.transcribe(
      file.buffer,
      file.mimetype,
      profileLanguage,
    );

    if (!sttResult?.transcript.trim()) {
      throw new BadRequestException(
        'Could not understand the audio. Please speak again.',
      );
    }

    if (sttResult.confidence < VOICE_STT_MIN_CONFIDENCE) {
      throw new BadRequestException(
        'Audio was unclear. Please speak again clearly.',
      );
    }

    const effectiveLanguage = resolveEffectiveLanguage(
      profileLanguage,
      sttResult.detectedLanguage,
      sttResult.languageConfidence,
    );

    if (effectiveLanguage !== profileLanguage) {
      this.logger.log(
        `audioQuery userId=${userId} using detected language=${effectiveLanguage} instead of profileLanguage=${profileLanguage}`,
      );
    }

    const response = await this.buildVoiceResponse(
      userId,
      sttResult.transcript,
      effectiveLanguage,
    );

    return {
      ...response,
      profileLanguage,
      detectedLanguage: sttResult.detectedLanguage,
      transcript: sttResult.transcript,
      sttConfidence: sttResult.confidence,
    };
  }

  async textQuery(
    userId: string,
    textQuery: string,
  ): Promise<VoiceTextQueryResponse> {
    const language = await this.resolveUserLanguage(userId);
    return this.buildVoiceResponse(userId, textQuery, language);
  }

  private async buildVoiceResponse(
    userId: string,
    textQuery: string,
    language: LanguageEnum,
  ): Promise<VoiceTextQueryResponse> {
    const aiResponse = await this.aiService.queryForVoice(
      userId,
      textQuery,
      language,
    );

    const ttsResult = await this.ttsService.synthesize(
      aiResponse.spokenResponse,
      language,
    );

    let audioUrl: string | null = null;
    if (ttsResult.audioBuffer) {
      audioUrl = await this.fileService.uploadAudioBuffer(
        ttsResult.audioBuffer,
        ttsResult.audioContentType ?? 'audio/mpeg',
        { userId },
      );
    }

    return {
      spokenResponse: aiResponse.spokenResponse,
      spokenResponseEnglish: aiResponse.spokenResponseEnglish,
      riskLevel: aiResponse.riskLevel,
      aiResponseText: aiResponse.aiResponseText,
      isDangerSign: aiResponse.isDangerSign,
      language,
      audioUrl,
      audioContentType: audioUrl
        ? (ttsResult.audioContentType ?? 'audio/mpeg')
        : null,
    };
  }

  private async resolveUserLanguage(userId: string): Promise<LanguageEnum> {
    const user = await this.userService.find({ id: userId });
    if (!user?.language) {
      throw new BadRequestException(
        'Profile language is not set. Please complete your profile first.',
      );
    }

    return user.language;
  }
}
