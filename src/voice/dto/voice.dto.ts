import { LanguageEnum } from '../../user/enum/user.enum';
import { AiRiskLevel } from '../../ai/enum/ai.enum';

export interface VoiceTextQueryBody {
  textQuery: string;
}

export interface VoiceTextQueryResponse {
  spokenResponse: string;
  spokenResponseEnglish: string;
  riskLevel: AiRiskLevel;
  aiResponseText: string;
  isDangerSign: boolean;
  language: LanguageEnum;
  audioUrl: string | null;
  audioContentType: string | null;
}

export interface VoiceQueryResponse extends VoiceTextQueryResponse {
  profileLanguage: LanguageEnum;
  detectedLanguage: LanguageEnum | null;
  transcript: string;
  sttConfidence: number;
}

export interface SttResult {
  transcript: string;
  confidence: number;
  detectedLanguage: LanguageEnum | null;
  languageConfidence: number;
}

export interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export interface UploadedVoiceFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}
