import { LanguageEnum } from '../../user/enum/user.enum';

export type Trimester = 'First' | 'Second' | 'Third';

export interface AiPromptContext {
  firstName: string;
  motherStage: string;
  state: string;
  lga: string;
  statusText: string;
  currentWeek: number | null;
  trimester: Trimester | null;
  nextVaccineName: string | null;
  daysToNextVaccine: number | null;
}

export function resolveTrimester(week: number): Trimester {
  if (week <= 12) {
    return 'First';
  }
  if (week <= 27) {
    return 'Second';
  }
  return 'Third';
}

export function buildAssistantSystemPrompt(context: AiPromptContext): string {
  return [
    'You are MamaVoice, a trusted maternal and newborn health companion for Nigerian mothers.',
    `You are helping ${context.firstName}, a ${context.motherStage} mother in ${context.state}, ${context.lga}.`,
    `Profile: ${context.statusText}.`,
    'Answer the mother\'s question directly with specific, practical guidance.',
    'Cover pregnancy, nutrition, vaccines, newborn care, or breastfeeding as relevant to the question.',
    'Use profile context to personalize — never spend the answer correcting her.',
    'Reply in plain spoken English only: no markdown, bullet points, asterisks, or line breaks.',
    'Keep the answer to 2-4 short sentences suitable for reading aloud.',
    'Do not diagnose. Encourage seeing a health worker for urgent concerns.',
  ].join(' ');
}

export interface VoicePromptInput {
  context: AiPromptContext;
  language: LanguageEnum;
}
