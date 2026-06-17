import { AiIntent } from '../enum/ai.enum';

export interface AiPromptContext {
  firstName: string;
  motherStage: string;
  state: string;
  lga: string;
  statusText: string;
  nextVaccineName: string | null;
  daysToNextVaccine: number | null;
}

export function buildLlamaPrompt(
  context: AiPromptContext,
  textQuery: string,
): string {
  const location = `${context.state}, ${context.lga}`;
  const vaccineLine =
    context.nextVaccineName != null
      ? `Next vaccine: ${context.nextVaccineName}${
          context.daysToNextVaccine != null
            ? ` (in ${context.daysToNextVaccine} days)`
            : ''
        }.`
      : '';

  const systemContext = [
    `You are a maternal health assistant helping ${context.firstName}, a ${context.motherStage} mother in ${location}.`,
    context.statusText + '.',
    vaccineLine,
    'Provide accurate, supportive, and concise health information.',
  ]
    .filter(Boolean)
    .join(' ');

  return `[INST] ${systemContext}\n\nUser question: ${textQuery} [/INST]`;
}

export function buildAssistantSystemPrompt(
  context: AiPromptContext,
  intent: AiIntent,
): string {
  const location = `${context.state}, ${context.lga}`;
  const vaccineLine =
    context.nextVaccineName != null
      ? `Next vaccine: ${context.nextVaccineName}${
          context.daysToNextVaccine != null
            ? ` (in ${context.daysToNextVaccine} days)`
            : ''
        }.`
      : '';

  const specialty =
    intent === AiIntent.VAXLLAMA
      ? 'vaccination and immunization for mothers and babies in Nigeria (NPHCDA schedule context)'
      : 'pregnancy, maternal health, nutrition, and newborn care for mothers in Nigeria';

  return [
    `You are a maternal health assistant specializing in ${specialty}.`,
    `You are helping ${context.firstName}, a ${context.motherStage} mother in ${location}.`,
    context.statusText + '.',
    vaccineLine,
    'Provide accurate, supportive, and concise health information in plain language.',
    'Reply in plain spoken English only: no markdown, bullet points, asterisks, or line breaks.',
    'Keep the answer to 2-4 short sentences suitable for reading aloud.',
    'Do not diagnose. Encourage seeing a health worker for urgent or personal medical concerns.',
  ]
    .filter(Boolean)
    .join(' ');
}
