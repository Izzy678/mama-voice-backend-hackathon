import { AiRiskLevel } from '../enum/ai.enum';


export interface AiQueryBody {
  textQuery: string;
}

export interface AiQueryResponse {
  aiResponseText: string;
  isDangerSign: boolean;
}

export interface AiVoiceQueryResponse {
  spokenResponse: string;
  spokenResponseEnglish: string;
  riskLevel: AiRiskLevel;
  aiResponseText: string;
  isDangerSign: boolean;
}
