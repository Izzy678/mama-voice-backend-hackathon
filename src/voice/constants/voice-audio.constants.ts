export const VOICE_AUDIO_MAX_BYTES = 5 * 1024 * 1024;
export const VOICE_STT_MIN_CONFIDENCE = 0.55;

export const ALLOWED_VOICE_AUDIO_MIME_TYPES = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/ogg',
  'audio/webm',
  'audio/mp4',
  'audio/aac',
  'audio/x-m4a',
  'audio/m4a',
  'video/mp4',
]);

export function isAllowedVoiceAudioMimeType(mimeType: string): boolean {
  const normalized = mimeType.split(';')[0]?.trim().toLowerCase() ?? '';
  return ALLOWED_VOICE_AUDIO_MIME_TYPES.has(normalized);
}

export function normalizeVoiceAudioMimeType(mimeType: string): string {
  const normalized = mimeType.split(';')[0]?.trim().toLowerCase() ?? 'audio/mpeg';

  if (normalized === 'audio/mp3') {
    return 'audio/mpeg';
  }

  if (normalized === 'audio/x-m4a' || normalized === 'audio/m4a') {
    return 'audio/mp4';
  }

  if (normalized === 'audio/x-wav' || normalized === 'audio/wave') {
    return 'audio/wav';
  }

  return normalized;
}
