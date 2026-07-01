import { LanguageEnum } from '../../user/enum/user.enum';

export const VOICE_STT_MIN_LANGUAGE_CONFIDENCE = 0.7;

const LANGUAGE_ALIASES: Record<string, LanguageEnum> = {
  yoruba: LanguageEnum.Yoruba,
  yo: LanguageEnum.Yoruba,
  'yo-ng': LanguageEnum.Yoruba,
  igbo: LanguageEnum.Igbo,
  ig: LanguageEnum.Igbo,
  'ig-ng': LanguageEnum.Igbo,
  hausa: LanguageEnum.Hausa,
  ha: LanguageEnum.Hausa,
  'ha-ng': LanguageEnum.Hausa,
};

export function normalizeDetectedLanguage(
  value: string | null | undefined,
): LanguageEnum | null {
  if (!value?.trim()) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[normalized];
  }

  const enumMatch = Object.values(LanguageEnum).find(
    (language) => language.toLowerCase() === normalized,
  );

  return enumMatch ?? null;
}

export function resolveEffectiveLanguage(
  profileLanguage: LanguageEnum,
  detectedLanguage: LanguageEnum | null,
  languageConfidence: number,
): LanguageEnum {
  if (
    detectedLanguage &&
    languageConfidence >= VOICE_STT_MIN_LANGUAGE_CONFIDENCE
  ) {
    return detectedLanguage;
  }

  return profileLanguage;
}
