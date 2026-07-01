import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum } from '../../user/enum/user.enum';
import { AiRiskLevel } from '../../ai/enum/ai.enum';

export class VoiceTextQueryRequestDto {
  @ApiProperty({
    example: 'Kini awon oúnjẹ tí mo gbọ́dọ̀ jẹ ní igba ọmọbírin?',
    minLength: 3,
    maxLength: 1000,
  })
  textQuery: string;
}

export class VoiceTextQueryResponseDto {
  @ApiProperty({
    example:
      'Amaka, ní ọsẹ̀ mẹ́fà, ó ṣe pàtàkì láti máa jẹ oúnjẹ tó dára bíi ẹ̀wa àti ẹ̀fọ̀...',
    description: 'Full conversational response in the user language for TTS playback',
  })
  spokenResponse: string;

  @ApiProperty({
    example:
      'Amaka, at six weeks pregnant, it is important to eat good foods like beans and vegetables...',
    description: 'The same response in English for on-screen reading',
  })
  spokenResponseEnglish: string;


  @ApiProperty({ enum: AiRiskLevel, example: AiRiskLevel.LOW })
  riskLevel: AiRiskLevel;

  @ApiProperty({
    example:
      'Amaka, at six weeks pregnant, it is important to eat good foods like beans and vegetables...',
    description: 'English text summary for display',
  })
  aiResponseText: string;

  @ApiProperty({ example: false })
  isDangerSign: boolean;

  @ApiProperty({ enum: LanguageEnum, example: LanguageEnum.Yoruba })
  language: LanguageEnum;

  @ApiProperty({
    nullable: true,
    example:
      'https://res.cloudinary.com/example/raw/upload/v123/help-mum/tts/user-id/file.mp3',
    description: 'Hosted URL for spokenResponse audio, null if TTS or upload failed',
  })
  audioUrl: string | null;

  @ApiProperty({ nullable: true, example: 'audio/mpeg' })
  audioContentType: string | null;
}

export class VoiceQueryResponseDto extends VoiceTextQueryResponseDto {
  @ApiProperty({ enum: LanguageEnum, example: LanguageEnum.Yoruba })
  profileLanguage: LanguageEnum;

  @ApiProperty({
    enum: LanguageEnum,
    example: LanguageEnum.Igbo,
    nullable: true,
    description: 'Language detected from audio, null if unknown',
  })
  detectedLanguage: LanguageEnum | null;

  @ApiProperty({
    example: 'Kini awon oúnjẹ tí mo gbọ́dọ̀ jẹ ní igba ọmọbírin?',
  })
  transcript: string;

  @ApiProperty({ example: 0.91, minimum: 0, maximum: 1 })
  sttConfidence: number;
}
