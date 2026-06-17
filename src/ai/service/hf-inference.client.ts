import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';

const DEFAULT_BASE_URL =
  'https://router.huggingface.co/hf-inference/models';
const DEFAULT_MAMABOT_MODEL = 'HelpMumHQ/MamaBot-Llama';
const DEFAULT_VAXLLAMA_MODEL = 'HelpMumHQ/vax-llama-1';
const DEFAULT_TEMPERATURE = 0.2;
const DEFAULT_MAX_NEW_TOKENS = 256;
const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 3;

interface HfGenerationResponse {
  generated_text?: string;
}

@Injectable()
export class HfInferenceClient {
  private readonly logger = new Logger(HfInferenceClient.name);

  constructor(private readonly configService: ConfigService) {}

  getMamabotModelId(): string {
    return (
      this.configService.get<string>(envEnum.MAMABOT_MODEL_ID) ??
      DEFAULT_MAMABOT_MODEL
    );
  }

  getVaxllamaModelId(): string {
    return (
      this.configService.get<string>(envEnum.VAXLLAMA_MODEL_ID) ??
      DEFAULT_VAXLLAMA_MODEL
    );
  }

  async generate(modelId: string, prompt: string): Promise<string | null> {
    const token = this.configService.get<string>(envEnum.HF_API_TOKEN);
    if (!token) {
      this.logger.error('HF_API_TOKEN is not configured');
      return null;
    }

    const baseUrl =
      this.configService.get<string>(envEnum.HF_INFERENCE_BASE_URL) ??
      DEFAULT_BASE_URL;
    const temperature = this.parseNumber(
      this.configService.get<string>(envEnum.AI_TEMPERATURE),
      DEFAULT_TEMPERATURE,
    );
    const maxNewTokens = this.parseNumber(
      this.configService.get<string>(envEnum.AI_MAX_NEW_TOKENS),
      DEFAULT_MAX_NEW_TOKENS,
    );

    const url = `${baseUrl.replace(/\/$/, '')}/${modelId}`;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: maxNewTokens,
              temperature,
              return_full_text: false,
            },
          }),
        });

        if (response.status === 503) {
          const waitMs = this.getRetryDelayMs(response, attempt);
          this.logger.warn(
            `Model ${modelId} loading (503). Retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
          );
          await this.sleep(waitMs);
          continue;
        }

        if (!response.ok) {
          const errorBody = await response.text();
          this.logger.error(
            `HF inference failed for ${modelId}: ${response.status} ${errorBody}`,
          );
          return null;
        }

        const data: unknown = await response.json();
        return this.extractGeneratedText(data);
      } catch (error) {
        this.logger.error(
          `HF inference request error for ${modelId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        if (attempt < MAX_RETRIES - 1) {
          await this.sleep(2000 * (attempt + 1));
          continue;
        }
        return null;
      }
    }

    return null;
  }

  private extractGeneratedText(data: unknown): string | null {
    if (Array.isArray(data)) {
      const first = data[0] as HfGenerationResponse | undefined;
      return first?.generated_text?.trim() || null;
    }

    if (data && typeof data === 'object' && 'generated_text' in data) {
      const text = (data as HfGenerationResponse).generated_text;
      return text?.trim() || null;
    }

    return null;
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

  private getRetryDelayMs(response: Response, attempt: number): number {
    const estimatedTime = response.headers.get('estimated_time');
    if (estimatedTime) {
      const seconds = Number(estimatedTime);
      if (!Number.isNaN(seconds) && seconds > 0) {
        return Math.ceil(seconds * 1000);
      }
    }
    return 5000 * (attempt + 1);
  }

  private parseNumber(value: string | undefined, fallback: number): number {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
