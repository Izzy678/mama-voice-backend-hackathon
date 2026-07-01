import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import type { AiPromptContext } from '../constants/ai-prompts';
import { buildAssistantSystemPrompt } from '../constants/ai-prompts';
import { LanguageEnum } from '../../user/enum/user.enum';
import { PromptBuilderService } from './prompt-builder.service';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_TEMPERATURE = 0.2;
const VOICE_MAX_OUTPUT_TOKENS = 4096;
const REQUEST_TIMEOUT_MS = 30_000;
const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
}

@Injectable()
export class GeminiClient {
  private readonly logger = new Logger(GeminiClient.name);
  private readonly model: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly promptBuilderService: PromptBuilderService,
  ) {
    this.model = this.configService.get<string>(envEnum.GEMINI_MODEL) ?? DEFAULT_GEMINI_MODEL;
    this.apiKey = this.configService.get<string>(envEnum.GEMINI_API_KEY)!;
  }

  async generateForText(
    context: AiPromptContext,
    textQuery: string,
  ): Promise<string | null> {
    const systemInstruction = buildAssistantSystemPrompt(context);
    const url = `${GEMINI_API_BASE}/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: this.promptBuilderService.buildVoiceUserMessage(textQuery),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: DEFAULT_TEMPERATURE,
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Gemini inference failed: ${response.status} ${errorBody}`,
        );
        return null;
      }

      const data = (await response.json()) as GeminiGenerateResponse;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return text || null;
    } catch (error) {
      this.logger.error(
        `Gemini request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  async generateForVoice(
    context: AiPromptContext,
    textQuery: string,
    language: LanguageEnum,
  ): Promise<string | null> {
    const systemInstruction = this.promptBuilderService.buildVoiceSystemPrompt({
      context,
      language,
    });
    const userMessage = this.promptBuilderService.buildVoiceUserMessage(textQuery);
    const url = `${GEMINI_API_BASE}/${this.model}:generateContent?key=${this.apiKey}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: DEFAULT_TEMPERATURE,
            maxOutputTokens: VOICE_MAX_OUTPUT_TOKENS,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Gemini voice inference failed: ${response.status} ${errorBody}`,
        );
        return null;
      }

      const data = (await response.json()) as GeminiGenerateResponse;
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text?.trim();

      return text || null;
    } catch (error) {
      this.logger.error(
        `Gemini voice request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }
}
