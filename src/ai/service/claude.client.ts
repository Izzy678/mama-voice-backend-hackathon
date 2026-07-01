import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import type { AiPromptContext } from '../constants/ai-prompts';
import { buildAssistantSystemPrompt } from '../constants/ai-prompts';

const DEFAULT_CLAUDE_MODEL = 'claude-3-5-haiku-20241022';
const DEFAULT_TEMPERATURE = 0.2;
const REQUEST_TIMEOUT_MS = 30_000;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

interface ClaudeMessageResponse {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
}

@Injectable()
export class ClaudeClient {
  private readonly logger = new Logger(ClaudeClient.name);

  constructor(private readonly configService: ConfigService) {}

  async generate(
    context: AiPromptContext,
    textQuery: string,
  ): Promise<string | null> {
    const apiKey = this.configService.get<string>(envEnum.ANTHROPIC_API_KEY);
    if (!apiKey) {
      this.logger.warn(
        'ANTHROPIC_API_KEY is not configured; skipping Claude fallback',
      );
      return null;
    }


    const system = buildAssistantSystemPrompt(context);

    try {
      const response = await this.fetchWithTimeout(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model: DEFAULT_CLAUDE_MODEL,
          //max_tokens: DEFAULT_MAX_OUTPUT_TOKENS,
          temperature: DEFAULT_TEMPERATURE,
          system,
          messages: [{ role: 'user', content: textQuery }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Claude inference failed: ${response.status} ${errorBody}`,
        );
        return null;
      }

      const data = (await response.json()) as ClaudeMessageResponse;
      const text = data.content
        ?.find((block) => block.type === 'text')
        ?.text?.trim();
      return text || null;
    } catch (error) {
      this.logger.error(
        `Claude request error: ${error instanceof Error ? error.message : String(error)}`,
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
