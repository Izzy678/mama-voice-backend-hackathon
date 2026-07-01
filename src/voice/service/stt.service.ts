import { Injectable, Logger } from '@nestjs/common';
import { LanguageEnum } from '../../user/enum/user.enum';
import { normalizeVoiceAudioMimeType } from '../constants/voice-audio.constants';
import { resolveEffectiveLanguage } from '../constants/resolve-detected-language';
import { GeminiSttClient } from './gemini-stt.client';
import { SpitchSttClient } from './spitch-stt.client';
import { SttResult } from '../dto/voice.dto';

@Injectable()
export class SttService {
  private readonly logger = new Logger(SttService.name);

  constructor(
    private readonly spitchSttClient: SpitchSttClient,
    private readonly geminiSttClient: GeminiSttClient,
  ) {}

  async transcribe(
    audio: Buffer,
    mimeType: string,
    profileLanguage: LanguageEnum,
  ): Promise<SttResult | null> {
    const normalizedMimeType = normalizeVoiceAudioMimeType(mimeType);

    const geminiResult = await this.geminiSttClient.transcribe(
      audio,
      normalizedMimeType,
      profileLanguage,
    );

    const sttLanguage = geminiResult
      ? resolveEffectiveLanguage(
          profileLanguage,
          geminiResult.detectedLanguage,
          geminiResult.languageConfidence,
        )
      : profileLanguage;

    const spitchResult = await this.spitchSttClient.transcribe(
      audio,
      normalizedMimeType,
      sttLanguage,
    );

    let result: SttResult | null;
    if (spitchResult) {
      result = {
        ...spitchResult,
        detectedLanguage:
          geminiResult?.detectedLanguage ?? spitchResult.detectedLanguage,
        languageConfidence:
          geminiResult?.languageConfidence ?? spitchResult.languageConfidence,
      };
    } else if (geminiResult) {
      this.logger.log('STT provider=Gemini (Spitch unavailable or failed)');
      result = geminiResult;
    } else {
      return null;
    }

    if (!result.transcript.trim()) {
      return result;
    }


    return {
      ...result,
      transcript: result.transcript,
      confidence: Math.min(result.confidence, geminiResult?.confidence ?? 0),
      detectedLanguage: sttLanguage,
    };
  }
}
