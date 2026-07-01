import { LanguageEnum } from '../../user/enum/user.enum';
import { STT_LANGUAGE_CODE } from './stt.constants';

export const SPITCH_TTS_URL = 'https://api.spitch.app/v1/speech';
export const SPITCH_MAX_TEXT_LENGTH = 2000;

/** Feminine Spitch voice IDs aligned with maternal health UX. */
export const SPITCH_VOICE_BY_LANGUAGE: Record<LanguageEnum, string> = {
  [LanguageEnum.English]: 'remi',
  [LanguageEnum.Yoruba]: 'funmi',
  [LanguageEnum.Igbo]: 'ngozi',
  [LanguageEnum.Hausa]: 'zainab',
};

export function resolveSpitchVoice(language: LanguageEnum): string {
  return SPITCH_VOICE_BY_LANGUAGE[language];
}

export function resolveSpitchLanguageCode(language: LanguageEnum): string {
  return STT_LANGUAGE_CODE[language];
}
