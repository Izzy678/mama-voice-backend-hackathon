import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import { LanguageEnum } from '../../user/enum/user.enum';
import {
  MATERNAL_HEALTH_STT_VOCABULARY,
  SPITCH_STT_URL,
  STT_LANGUAGE_CODE,
} from '../constants/stt.constants';
import { SttResult } from '../dto/voice.dto';

const REQUEST_TIMEOUT_MS = 45_000;

interface SpitchTranscriptionResponse {
  text?: string;
}

@Injectable()
export class SpitchSttClient {
  private readonly logger = new Logger(SpitchSttClient.name);

  constructor(private readonly configService: ConfigService) {}

  async transcribe(
    audio: Buffer,
    mimeType: string,
    language: LanguageEnum,
  ): Promise<SttResult | null> {
    const apiKey = this.configService.get<string>(envEnum.SPITCH_API_KEY);
    if (!apiKey) {
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const formData = new FormData();
      const blob = new Blob([Uint8Array.from(audio)], { type: mimeType });
      formData.append('content', blob, `audio.${this.extensionForMime(mimeType)}`);
      formData.append('language', STT_LANGUAGE_CODE[language]);
      formData.append('special_words', MATERNAL_HEALTH_STT_VOCABULARY);

      const response = await fetch(SPITCH_STT_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Spitch STT failed: ${response.status} ${errorBody}`);
        return null;
      }

      const data = (await response.json()) as SpitchTranscriptionResponse;
      const transcript = data.text?.trim() ?? '';
      if (!transcript) {
        return null;
      }

      this.logger.log(
        `Spitch STT succeeded language=${language} transcript="${this.truncate(transcript)}"`,
      );

      return {
        transcript,
        confidence: 0.92,
        detectedLanguage: language,
        languageConfidence: 0.9,
      };
    } catch (error) {
      this.logger.error(
        `Spitch STT request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  private extensionForMime(mimeType: string): string {
    if (mimeType.includes('wav')) return 'wav';
    if (mimeType.includes('ogg')) return 'ogg';
    if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a';
    return 'mp3';
  }

  private truncate(value: string, maxLength = 120): string {
    const trimmed = value.trim();
    if (trimmed.length <= maxLength) {
      return trimmed;
    }
    return `${trimmed.slice(0, maxLength)}...`;
  }
}
