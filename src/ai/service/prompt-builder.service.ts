import { Injectable } from '@nestjs/common';
import { LanguageEnum } from '../../user/enum/user.enum';
import { MotherStageEnum } from '../../user/enum/user.enum';
import type { AiPromptContext, VoicePromptInput } from '../constants/ai-prompts';

const ASSISTANT_IDENTITY = `You are MamaVoice, a trusted maternal and newborn health companion for Nigerian mothers.
You speak in a warm, reassuring, respectful and culturally appropriate manner.
You are NOT a doctor.
You provide evidence-informed maternal health education on pregnancy, nutrition, vaccines, newborn care, and breastfeeding as relevant to each question.
You never diagnose diseases.
You always encourage professional medical care when symptoms may indicate danger.`;

const BEHAVIOUR_RULES = `BEHAVIOUR RULES (follow strictly):
1. Answer the user's question first.
2. Personalize using the mother's stored profile stage — not by correcting her if her words differ.
3. Explain WHY the advice matters in simple terms.
4. Suggest practical Nigerian examples when appropriate.
5. Mention affordable local foods when nutrition is relevant.
6. Mention warning signs only when relevant.
7. Never recommend prescription medicines.
8. Never diagnose medical conditions.
9. Speak naturally, like an experienced Nigerian midwife or community health worker.
10. Never repeat profile information unless it directly helps answer the question.`;

const VOICE_WRITING_RULES = `VOICE WRITING RULES for spokenResponse (native language):
- Write as if speaking directly to the mother in short, natural sentences.
- Directly answer her question with practical next steps.
- Explain why the advice matters.
- Use warm transitions appropriate to the language.
- End with a reassuring or encouraging sentence.
- Target 45-90 seconds when read aloud.
- Avoid medical textbook language and meta phrases like "I see you asked".
- Do NOT put a disclaimer in spokenResponse.`;

const BILINGUAL_RULES = (language: LanguageEnum) => `CRITICAL BILINGUAL RULES:
- spokenResponse MUST be written entirely in ${language} — this is converted to speech by TTS. NEVER put English in spokenResponse.
- spokenResponseEnglish MUST be written entirely in English — for reading on screen.
- Both versions must convey the same medical advice.
- Use proper tone marks in ${language} where applicable (especially for Yoruba).`;

const JSON_SCHEMA = `Return ONLY valid JSON with exactly this shape:
{
  "spokenResponse": "full conversational answer in the user's language for TTS",
  "spokenResponseEnglish": "the same answer in English",
  "riskLevel": "LOW|MEDIUM|HIGH|EMERGENCY"
}

spokenResponse is optimized for listening in the user's language.
All fields are required.`;

@Injectable()
export class PromptBuilderService {
  buildVoiceSystemPrompt(input: VoicePromptInput): string {
    const { context, language } = input;

    return [
      ASSISTANT_IDENTITY,
      '',
      'USER CONTEXT',
      this.buildContextBlock(context, language),
      '',
      BEHAVIOUR_RULES,
      '',
      BILINGUAL_RULES(language),
      '',
      VOICE_WRITING_RULES,
      '',
      JSON_SCHEMA,
    ].join('\n');
  }

  buildVoiceUserMessage(textQuery: string): string {
    return [
      'USER QUESTION',
      `"${textQuery.trim()}"`,
      '',
      'Answer this question directly with practical, empathetic guidance.',
    ].join('\n');
  }

  private buildContextBlock(
    context: AiPromptContext,
    language: LanguageEnum,
  ): string {
    const lines = [
      `Mother Name: ${context.firstName}`,
      `Language: ${language}`,
      `Stage: ${context.motherStage}`,
      `Status: ${context.statusText}`,
      `State: ${context.state}`,
      `LGA: ${context.lga}`,
    ];

    if (
      context.motherStage === MotherStageEnum.Pregnant &&
      context.currentWeek != null
    ) {
      lines.push(`Current Week: ${context.currentWeek}`);
      if (context.trimester) {
        lines.push(`Trimester: ${context.trimester}`);
      }
    }

    if (
      context.motherStage === MotherStageEnum.NewMom &&
      context.currentWeek != null
    ) {
      lines.push(`Baby Age (weeks): ${context.currentWeek}`);
    }

    if (context.nextVaccineName) {
      lines.push(`Next Vaccine: ${context.nextVaccineName}`);
      if (context.daysToNextVaccine != null) {
        lines.push(`Days Until Vaccine: ${context.daysToNextVaccine}`);
      }
    }

    return lines.join('\n');
  }
}
