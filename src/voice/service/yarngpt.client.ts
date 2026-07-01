import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import { YARNGPT_MAX_TEXT_LENGTH, YARNGPT_TTS_URL } from '../constants/yarngpt-voices';

const REQUEST_TIMEOUT_MS = 30_000;

@Injectable()
export class YarngptClient {
  private readonly logger = new Logger(YarngptClient.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>(envEnum.YARNGPT_API_KEY)!;
  }

  async synthesize(text: string, voice: string): Promise<Buffer | null> {


    const trimmed = text.trim().slice(0, YARNGPT_MAX_TEXT_LENGTH);
    if (!trimmed) {
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(YARNGPT_TTS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmed,
          voice,
          response_format: 'mp3',
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`YarnGPT TTS failed: ${response.status} ${errorBody}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      this.logger.error(
        `YarnGPT TTS request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}
