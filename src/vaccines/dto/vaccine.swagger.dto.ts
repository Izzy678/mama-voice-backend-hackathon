import { ApiProperty } from '@nestjs/swagger';

export class VaccineItemDto {
  @ApiProperty({ example: 'vax-6' })
  vaccineId: string;

  @ApiProperty({ example: 'Penta 1, OPV 1, PCV 1 & Rotavirus 1' })
  vaccineName: string;

  @ApiProperty({ example: '6 Weeks' })
  dueDateString: string;

  @ApiProperty({ example: '2024-03-01', nullable: true })
  dueDate: string | null;

  @ApiProperty({ example: false })
  isCompleted: boolean;

  @ApiProperty({ example: '2024-03-01', nullable: true })
  administeredDate: string | null;

  @ApiProperty({ example: null, nullable: true })
  sideEffects: string | null;
}

export class VaccinesListResponseDto {
  @ApiProperty({ type: [VaccineItemDto] })
  vaccines: VaccineItemDto[];
}

export class LogVaccineRequestDto {
  @ApiProperty({ example: 'vax-6', description: 'Vaccine ID from the schedule (e.g. vax-0, vax-6, vax-10...)' })
  vaccineId: string;

  @ApiProperty({ example: '2024-03-01', description: 'ISO date string of when the vaccine was administered' })
  administeredDate: string;

  @ApiProperty({ example: 'Penta 1, OPV 1, PCV 1 & Rotavirus 1', required: false, nullable: true, description: 'Optional display name — falls back to the schedule name if omitted' })
  vaccineName?: string;

  @ApiProperty({ example: true, required: false, description: 'Whether the vaccine was completed. Defaults to true if omitted' })
  isCompleted?: boolean;

  @ApiProperty({ example: 'mild fever for 24 hours', required: false, nullable: true })
  sideEffects?: string;
}

export class LogVaccineResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440099' })
  id: string;

  @ApiProperty({ example: 'vax-6' })
  vaccineId: string;

  @ApiProperty({ example: 'Penta 1, OPV 1, PCV 1 & Rotavirus 1' })
  vaccineName: string;

  @ApiProperty({ example: true })
  isCompleted: boolean;

  @ApiProperty({ example: '2024-03-01', nullable: true })
  administeredDate: string | null;

  @ApiProperty({ example: 'mild fever for 24 hours', nullable: true })
  sideEffects: string | null;

  @ApiProperty({ example: '2024-03-01T10:00:00.000Z' })
  updatedAt: Date;
}
