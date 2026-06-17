import { ApiProperty } from '@nestjs/swagger';

export class AiQueryRequestDto {
  @ApiProperty({
    example: 'What foods should I eat in my second trimester?',
    minLength: 3,
    maxLength: 1000,
  })
  textQuery: string;
}

export class AiQueryResponseDto {
  @ApiProperty({
    example:
      'Iron-rich foods like spinach and beans are helpful during pregnancy. This is general health information. Please consult a health worker for personal medical advice.',
  })
  aiResponseText: string;

  @ApiProperty({ example: false })
  isDangerSign: boolean;
}
