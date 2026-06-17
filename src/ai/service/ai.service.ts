import { Injectable, Logger } from '@nestjs/common';
import { AiIntent } from '../enum/ai.enum';
import { buildLlamaPrompt } from '../constants/ai-prompts';
import {
  MEDICAL_DISCLAIMER,
  UNAVAILABLE_FALLBACK,
} from '../constants/ai-fallbacks';
import { cleanAiResponseText } from '../constants/clean-ai-response';
import { AiContextService } from './ai-context.service';
import { AiRouterService } from './ai-router.service';
import { AiSafetyService } from './ai-safety.service';
import { HfInferenceClient } from './hf-inference.client';
import { GeminiClient } from './gemini.client';
import { ClaudeClient } from './claude.client';
import type { AiQueryResponse } from '../dto/ai.dto';
import { MotherStageEnum } from '../../user/enum/user.enum';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiSafetyService: AiSafetyService,
    private readonly aiContextService: AiContextService,
    private readonly aiRouterService: AiRouterService,
    private readonly hfInferenceClient: HfInferenceClient,
    private readonly geminiClient: GeminiClient,
    private readonly claudeClient: ClaudeClient,
  ) {}

  async query(userId: string, textQuery: string): Promise<AiQueryResponse> {
    if (this.aiSafetyService.hasEmergencyKeywords(textQuery)) {
      return {
        aiResponseText: this.appendDisclaimer(
          this.aiSafetyService.getEmergencyResponse(),
        ),
        isDangerSign: true,
      };
    }

    const context = await this.aiContextService.buildContext(userId);
    const motherStage = context.motherStage as MotherStageEnum;
    const intent = this.aiRouterService.classifyIntent(textQuery, motherStage);

    let rawResponse = await this.geminiClient.generate(
      context,
      textQuery,
      intent,
    );

    if (!rawResponse?.trim()) {
      this.logger.warn('Gemini failed; trying Claude fallback');
      rawResponse = await this.claudeClient.generate(
        context,
        textQuery,
        intent,
      );
    }

    if (!rawResponse?.trim()) {
      const modelId =
        intent === AiIntent.VAXLLAMA
          ? this.hfInferenceClient.getVaxllamaModelId()
          : this.hfInferenceClient.getMamabotModelId();
      const prompt = buildLlamaPrompt(context, textQuery);

      this.logger.warn(
        `Claude fallback failed; trying Hugging Face (${modelId})`,
      );
      rawResponse = await this.hfInferenceClient.generate(modelId, prompt);
    }

    const responseText = cleanAiResponseText(
      rawResponse?.trim() || UNAVAILABLE_FALLBACK,
    );

    const isDangerSign =
      this.aiSafetyService.hasEmergencyKeywords(responseText);

    return {
      aiResponseText: responseText,
      isDangerSign,
    };
  }

  private appendDisclaimer(text: string): string {
    const trimmed = text.trim();
    if (trimmed.includes(MEDICAL_DISCLAIMER)) {
      return trimmed;
    }
    return `${trimmed} ${MEDICAL_DISCLAIMER}`;
  }
}
