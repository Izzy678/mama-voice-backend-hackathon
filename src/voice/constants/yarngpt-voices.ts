import { LanguageEnum } from '../../user/enum/user.enum';

export const YARNGPT_TTS_URL = 'https://yarngpt.ai/api/v1/tts';
export const YARNGPT_MAX_TEXT_LENGTH = 2000;

export const YARNGPT_VOICE_BY_LANGUAGE: Record<LanguageEnum, string> = {
  [LanguageEnum.English]: 'Zainab',
  [LanguageEnum.Yoruba]: 'Wura',
  [LanguageEnum.Igbo]: 'Chinenye',
  [LanguageEnum.Hausa]: 'Zainab',
};

export function resolveYarngptVoice(language: LanguageEnum): string {
  return YARNGPT_VOICE_BY_LANGUAGE[language];
}
