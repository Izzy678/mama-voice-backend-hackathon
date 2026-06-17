import { ApiProperty } from '@nestjs/swagger';

export class HealthLogItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440099' })
  id: string;

  @ApiProperty({ example: '2024-03-15' })
  logDate: string;

  @ApiProperty({ example: 68.5, nullable: true })
  weightKg: number | null;

  @ApiProperty({ example: '120/80', nullable: true })
  bloodPressure: string | null;

  @ApiProperty({ example: 'Ate beans, vegetables and eba', nullable: true })
  nutritionNotes: string | null;

  @ApiProperty({ example: 'Mild fatigue and back pain', nullable: true })
  symptoms: string | null;

  @ApiProperty({ example: '2024-03-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-15T10:00:00.000Z' })
  updatedAt: Date;
}

export class HealthHistoryResponseDto {
  @ApiProperty({ type: [HealthLogItemDto] })
  logs: HealthLogItemDto[];
}

export class LogHealthRequestDto {
  @ApiProperty({ example: '2024-03-15', description: 'ISO date string for the log entry' })
  logDate: string;

  @ApiProperty({ example: 68.5, required: false, nullable: true, description: 'Weight in kilograms' })
  weightKg?: number;

  @ApiProperty({ example: '120/80', required: false, nullable: true, description: 'Blood pressure reading (systolic/diastolic)' })
  bloodPressure?: string;

  @ApiProperty({ example: 'Ate beans, vegetables and eba', required: false, nullable: true })
  nutritionNotes?: string;

  @ApiProperty({ example: 'Mild fatigue and back pain', required: false, nullable: true })
  symptoms?: string;
}
