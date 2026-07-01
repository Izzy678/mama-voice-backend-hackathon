import { LanguageEnum } from '../../user/enum/user.enum';

export const SPITCH_STT_URL = 'https://api.spitch.app/v1/transcriptions';

/** ISO 639 codes for Spitch STT. */
export const STT_LANGUAGE_CODE: Record<LanguageEnum, string> = {
  [LanguageEnum.English]: 'en',
  [LanguageEnum.Yoruba]: 'yo',
  [LanguageEnum.Igbo]: 'ig',
  [LanguageEnum.Hausa]: 'ha',
};

/**
 * Domain vocabulary to improve recognition of maternal health queries.
 * Used by Spitch special_words and Gemini STT prompts.
 */
export const MATERNAL_HEALTH_STT_VOCABULARY = [
  'oúnjẹ',
  'ounje',
  'ọmọ',
  'omọ',
  'irora',
  'ajẹ',
  'aje',
  'ojoojumọ',
  'aláìsàn',
  'wíwọ̀',
  'oyun',
  'ọmọbírin',
  'àmì',
  'aje',
  'nnọọ',
  'kedu',
  'bawo',
  'kini',
  'vaccine',
  'immunization',
  'trimester',
  'pregnancy',
  'newborn',
  'breastfeeding',
  'ugu',
  'tete',
  'ogi',
].join(', ');
