import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envEnum } from '../../utils/enum/env.enum';
import { LanguageEnum } from '../../user/enum/user.enum';
import { normalizeDetectedLanguage } from '../constants/resolve-detected-language';
import { MATERNAL_HEALTH_STT_VOCABULARY } from '../constants/stt.constants';
import { GeminiGenerateResponse, SttResult } from '../dto/voice.dto';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const REQUEST_TIMEOUT_MS = 45_000;
const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';


@Injectable()
export class GeminiSttClient {
  private readonly logger = new Logger(GeminiSttClient.name);

  constructor(private readonly configService: ConfigService) {}

  async transcribe(
    audio: Buffer,
    mimeType: string,
    language: LanguageEnum,
  ): Promise<SttResult | null> {
    const apiKey = this.configService.get<string>(envEnum.GEMINI_API_KEY);
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured; skipping STT');
      return null;
    }

    const model =
      this.configService.get<string>(envEnum.GEMINI_MODEL) ??
      DEFAULT_GEMINI_MODEL;
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: audio.toString('base64'),
                  },
                },
                {
                  text: [
                    `Transcribe maternal health voice queries from Nigerian mothers.`,
                    `Detect the primary spoken language: Yoruba, Igbo, Hausa, or English.`,
                    `The user's profile language is ${language} — use as a hint only when unsure.`,
                    `For Yoruba, use proper orthography and tone marks where possible (e.g. oúnjẹ, ọmọ, báwo).`,
                    `Likely vocabulary: ${MATERNAL_HEALTH_STT_VOCABULARY}.`,
                    `Return valid JSON only: {"transcript":"exact words spoken","confidence":0.0,"detectedLanguage":"Yoruba","languageConfidence":0.0}.`,
                    `detectedLanguage must be one of: Yoruba, Igbo, Hausa, English.`,
                    `confidence is 0 to 1 for transcript accuracy — use below 0.6 if unsure about words.`,
                    `languageConfidence is 0 to 1 for detectedLanguage.`,
                    `If silent or unintelligible, return {"transcript":"","confidence":0,"detectedLanguage":"English","languageConfidence":0}.`,
                  ].join(' '),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Gemini STT failed: ${response.status} ${errorBody}`);
        return null;
      }

      const data = (await response.json()) as GeminiGenerateResponse;
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!rawText) {
        return null;
      }

      return this.parseSttResponse(rawText);
    } catch (error) {
      this.logger.error(
        `Gemini STT request error: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  private parseSttResponse(raw: string): SttResult | null {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        transcript?: unknown;
        confidence?: unknown;
        detectedLanguage?: unknown;
        languageConfidence?: unknown;
      };
      const transcript =
        typeof parsed.transcript === 'string' ? parsed.transcript.trim() : '';
      const confidence =
        typeof parsed.confidence === 'number'
          ? Math.min(1, Math.max(0, parsed.confidence))
          : transcript
            ? 0.85
            : 0;
      const detectedLanguage =
        typeof parsed.detectedLanguage === 'string'
          ? normalizeDetectedLanguage(parsed.detectedLanguage)
          : null;
      const languageConfidence =
        typeof parsed.languageConfidence === 'number'
          ? Math.min(1, Math.max(0, parsed.languageConfidence))
          : detectedLanguage
            ? 0.75
            : 0;

      return { transcript, confidence, detectedLanguage, languageConfidence };
    } catch {
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
