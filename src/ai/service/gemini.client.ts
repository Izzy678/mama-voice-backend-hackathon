import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import type { AiPromptContext } from '../constants/ai-prompts';
import { buildAssistantSystemPrompt } from '../constants/ai-prompts';
import { AiIntent } from '../enum/ai.enum';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_OUTPUT_TOKENS = 256;
const REQUEST_TIMEOUT_MS = 30_000;
const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

@Injectable()
export class GeminiClient {
  private readonly logger = new Logger(GeminiClient.name);

  constructor(private readonly configService: ConfigService) {}

  async generate(
    context: AiPromptContext,
    textQuery: string,
    intent: AiIntent,
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>(envEnum.GEMINI_API_KEY);
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY is not configured; skipping Gemini fallback',
      );
      return null;
    }

    const model =
      this.configService.get<string>(envEnum.GEMINI_MODEL) ??
      DEFAULT_GEMINI_MODEL;
    const temperature = this.parseNumber(
      this.configService.get<string>(envEnum.AI_TEMPERATURE),
      DEFAULT_TEMPERATURE,
    );
    const maxOutputTokens = this.parseNumber(
      this.configService.get<string>(envEnum.AI_MAX_NEW_TOKENS),
      DEFAULT_MAX_OUTPUT_TOKENS,
    );
    const systemInstruction = buildAssistantSystemPrompt(context, intent);
    console.log('systemInstruction', systemInstruction);
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

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
              parts: [{ text: textQuery }],
            },
          ],
          generationConfig: {
            temperature,
          //  maxOutputTokens,
            // thinkingConfig: {
            //   thinkingBudget: 0,
            // },
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

      console.log('data', data);
      console.log('data.candidates', data.candidates);
      console.log('data.candidates[0]', data.candidates?.[0]);
      console.log('data.candidates[0].content', data.candidates?.[0]?.content);
      console.log('data.candidates[0].content.parts', data.candidates?.[0]?.content?.parts);
      console.log('data.candidates[0].content.parts[0]', data.candidates?.[0]?.content?.parts?.[0]);
      console.log('data.candidates[0].content.parts[0].text', data.candidates?.[0]?.content?.parts?.[0]?.text);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      console.log('text', text);
      return text || null;
    } catch (error) {
      this.logger.error(
        `Gemini request error: ${error instanceof Error ? error.message : String(error)}`,
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

  private parseNumber(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
}
