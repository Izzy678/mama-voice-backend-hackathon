import { Injectable, Logger } from '@nestjs/common';
import { AiContextService } from './ai-context.service';
import { GeminiClient } from './gemini.client';
import { ClaudeClient } from './claude.client';
import type { AiQueryResponse, AiVoiceQueryResponse } from '../dto/ai.dto';
import { AiRiskLevel } from '../enum/ai.enum';
import { LanguageEnum } from '../../user/enum/user.enum';

const UNAVAILABLE_FALLBACK =
  'I am unable to answer right now. For urgent concerns, please contact your health worker or visit the nearest facility.';


@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiContextService: AiContextService,
    private readonly geminiClient: GeminiClient,
    private readonly claudeClient: ClaudeClient,
  ) { }

  async query(userId: string, textQuery: string): Promise<AiQueryResponse> {
    const context = await this.aiContextService.buildContext(userId);

    let rawResponse = await this.geminiClient.generateForText(
      context,
      textQuery,
    );

    if (!rawResponse?.trim()) {
      this.logger.warn('Gemini failed; trying Claude fallback');
      rawResponse = await this.claudeClient.generate(context, textQuery);
    }

    return {
      aiResponseText: rawResponse?.trim() || UNAVAILABLE_FALLBACK,
      isDangerSign: false,
    };
  }

  async queryForVoice(
    userId: string,
    textQuery: string,
    language: LanguageEnum,
  ): Promise<AiVoiceQueryResponse> {
    const context = await this.aiContextService.buildContext(userId);

    const rawResponse = await this.geminiClient.generateForVoice(
      context,
      textQuery,
      language,
    );
    const parsed = JSON.parse(rawResponse || '{}') as AiVoiceQueryResponse;

    return {
      spokenResponse: parsed?.spokenResponse || UNAVAILABLE_FALLBACK,
      spokenResponseEnglish: parsed?.spokenResponseEnglish || UNAVAILABLE_FALLBACK,
      riskLevel: parsed?.riskLevel || AiRiskLevel.LOW,
      aiResponseText: parsed.aiResponseText || UNAVAILABLE_FALLBACK,
      isDangerSign: false,
    };
  }


}
