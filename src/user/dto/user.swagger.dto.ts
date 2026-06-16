import { ApiProperty } from '@nestjs/swagger';
import {
  AccountStatusEnum,
  LanguageEnum,
  MotherStageEnum,
} from '../enum/user.enum';
import { ALL_LGAS, NIGERIAN_STATES } from '../constants/nigeria.constants';

export class UpdateProfileRequestDto {
  @ApiProperty({
    example: 'Amaka',
    description: 'First name (2–50 characters; letters, spaces, hyphens, apostrophes)',
    minLength: 2,
    maxLength: 50,
  })
  firstName: string;

  @ApiProperty({
    example: 'Okafor',
    description: 'Last name (2–50 characters; letters, spaces, hyphens, apostrophes)',
    minLength: 2,
    maxLength: 50,
  })
  lastName: string;

  @ApiProperty({
    enum: LanguageEnum,
    example: LanguageEnum.Igbo,
    description: 'Preferred language for app UI, voice responses, and notifications',
  })
  language: LanguageEnum;

  @ApiProperty({
    enum: NIGERIAN_STATES,
    example: 'Enugu',
    description: 'Nigerian state of residence',
  })
  state: string;

  @ApiProperty({
    enum: ALL_LGAS,
    example: 'Enugu North',
    description: 'Local Government Area — must belong to the selected state',
  })
  lga: string;

  @ApiProperty({
    enum: MotherStageEnum,
    example: MotherStageEnum.Pregnant,
    description:
      'Whether the user is currently pregnant or postpartum. Determines the next onboarding step (pregnancy record vs baby profile).',
  })
  motherStage: MotherStageEnum;

  @ApiProperty({
    example: '2025-09-15',
    description: 'ISO date. Due date if pregnant; baby\'s date of birth if postpartum',
  })
  targetDate: string;
}

export class UserProfileDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'amaka@example.com' })
  email: string;

  @ApiProperty({ example: 'Amaka', nullable: true })
  firstName: string | null;

  @ApiProperty({ example: 'Okafor', nullable: true })
  lastName: string | null;

  @ApiProperty({ enum: LanguageEnum, example: LanguageEnum.Igbo, nullable: true })
  language: LanguageEnum | null;

  @ApiProperty({ example: 'Enugu', nullable: true })
  state: string | null;

  @ApiProperty({ example: 'Enugu North', nullable: true })
  lga: string | null;

  @ApiProperty({ enum: MotherStageEnum, example: MotherStageEnum.Pregnant, nullable: true })
  motherStage: MotherStageEnum | null;

  @ApiProperty({
    example: '2025-09-15',
    nullable: true,
    description: 'Due date if pregnant; baby\'s date of birth if postpartum',
  })
  targetDate: Date | null;

  @ApiProperty({ enum: AccountStatusEnum, example: AccountStatusEnum.Active })
  accountStatus: AccountStatusEnum;

  @ApiProperty({ example: true })
  emailVerified: boolean;

  @ApiProperty({
    example: true,
    description: 'True once all onboarding profile fields have been submitted',
  })
  profileCompleted: boolean;
}
