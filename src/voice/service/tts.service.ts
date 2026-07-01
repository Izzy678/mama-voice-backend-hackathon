import { Injectable, Logger } from '@nestjs/common';
import { LanguageEnum } from '../../user/enum/user.enum';
import { resolveYarngptVoice } from '../constants/yarngpt-voices';
import { SpitchTtsClient } from './spitch-tts.client';
import { YarngptClient } from './yarngpt.client';

export interface TtsResult {
  audioBuffer: Buffer | null;
  audioContentType: string | null;
  provider: 'spitch' | 'yarngpt' | null;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);

  constructor(
    private readonly spitchTtsClient: SpitchTtsClient,
    private readonly yarngptClient: YarngptClient,
  ) {}

  async synthesize(text: string, language: LanguageEnum): Promise<TtsResult> {
    const spitchResult = await this.spitchTtsClient.synthesize(text, language);
    if (spitchResult) {
      return {
        audioBuffer: spitchResult.buffer,
        audioContentType: spitchResult.contentType,
        provider: 'spitch',
      };
    }

    const voice = resolveYarngptVoice(language);
    this.logger.log(`TTS falling back to YarnGPT voice=${voice}`);
    const yarngptBuffer = await this.yarngptClient.synthesize(text, voice);
    if (yarngptBuffer) {
      return {
        audioBuffer: yarngptBuffer,
        audioContentType: 'audio/mpeg',
        provider: 'yarngpt',
      };
    }

    return {
      audioBuffer: null,
      audioContentType: null,
      provider: null,
    };
  }
}
