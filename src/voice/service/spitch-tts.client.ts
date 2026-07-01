import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import { LanguageEnum } from '../../user/enum/user.enum';
import {
  resolveSpitchLanguageCode,
  resolveSpitchVoice,
  SPITCH_MAX_TEXT_LENGTH,
  SPITCH_TTS_URL,
} from '../constants/spitch-voices';

const REQUEST_TIMEOUT_MS = 30_000;

export interface TtsSynthesisResult {
  buffer: Buffer;
  contentType: string;
}

@Injectable()
export class SpitchTtsClient {
  private readonly logger = new Logger(SpitchTtsClient.name);

  constructor(private readonly configService: ConfigService) {}

  async synthesize(
    text: string,
    language: LanguageEnum,
  ): Promise<TtsSynthesisResult | null> {
    const apiKey = this.configService.get<string>(envEnum.SPITCH_API_KEY);
    if (!apiKey) {
      return null;
    }

    const trimmed = text.trim().slice(0, SPITCH_MAX_TEXT_LENGTH);
    if (!trimmed) {
      return null;
    }

    const voice = resolveSpitchVoice(language);
    const languageCode = resolveSpitchLanguageCode(language);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(SPITCH_TTS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmed,
          voice,
          language: languageCode,
          format: 'mp3',
          speed: 1.0,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Spitch TTS failed: ${response.status} ${errorBody}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') ?? 'audio/mpeg';

      this.logger.log(
        `Spitch TTS succeeded language=${language} voice=${voice} bytes=${arrayBuffer.byteLength}`,
      );

      return {
        buffer: Buffer.from(arrayBuffer),
        contentType,
      };
    } catch (error) {
      this.logger.error(
        `Spitch TTS request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}
