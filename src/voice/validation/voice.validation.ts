import { BadRequestException } from '@nestjs/common';
import Joi from 'joi';
import { VOICE_AUDIO_MAX_BYTES, isAllowedVoiceAudioMimeType } from '../constants/voice-audio.constants';
import { UploadedVoiceFile } from '../dto/voice.dto';

export const voiceTextQueryValidator = Joi.object({
  textQuery: Joi.string()
    .trim()
    .min(3)
    .max(1000)
    .required()
    .messages({
      'string.min': 'textQuery must be at least 3 characters',
      'string.max': 'textQuery must not exceed 1000 characters',
      'any.required': 'textQuery is required',
    }),
});


export function assertValidVoiceAudioFile(
  file: UploadedVoiceFile | undefined,
): asserts file is UploadedVoiceFile {
  if (!file) {
    throw new BadRequestException('audio file is required');
  }

  if (!file.buffer?.length) {
    throw new BadRequestException('audio file is empty');
  }

  if (file.size > VOICE_AUDIO_MAX_BYTES) {
    throw new BadRequestException('audio file must not exceed 5 MB');
  }

  if (!isAllowedVoiceAudioMimeType(file.mimetype)) {
    throw new BadRequestException(
      'Unsupported audio format. Use MP3, WAV, OGG, M4A, AAC, or WebM.',
    );
  }
}
