import { ApiProperty } from '@nestjs/swagger';
import {
  AccountStatusEnum,
  LanguageEnum,
  MotherStageEnum,
} from '../enum/user.enum';

export class SetProfileRequestDto {
  @ApiProperty({ example: 'Amina', description: 'First name (2–50 characters)' })
  firstName: string;

  @ApiProperty({
    example: 'PREGNANT',
    enum: ['PREGNANT', 'NEW_MOM'],
    description: 'PREGNANT = due date expected, NEW_MOM = baby already born',
  })
  type: 'PREGNANT' | 'NEW_MOM';

  @ApiProperty({
    example: '2025-09-15',
    description: 'ISO date. Due date if PREGNANT; baby\'s date of birth if NEW_MOM',
  })
  targetDate: string;
}

export class SetProfileResponseDto {
  @ApiProperty({ example: 'SUCCESS' })
  status: string;
}

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
    example: '08012345678',
    description:
      'Nigerian mobile number. Accepts local (080…) or international (+234…) format. Stored as +234XXXXXXXXXX.',
  })
  phoneNumber: string;

  @ApiProperty({
    enum: LanguageEnum,
    example: LanguageEnum.Igbo,
    description: 'Preferred language for app UI, voice responses, and notifications',
  })
  language: LanguageEnum;

  @ApiProperty({
    example: 'Enugu',
    description: 'Nigerian state of residence',
    minLength: 2,
    maxLength: 100,
  })
  state: string;

  @ApiProperty({
    example: 'Enugu North',
    description: 'Local Government Area (LGA)',
    minLength: 2,
    maxLength: 100,
  })
  lga: string;

  @ApiProperty({
    enum: MotherStageEnum,
    example: MotherStageEnum.Pregnant,
    description:
      'Whether the user is currently pregnant or postpartum. Determines the next onboarding step (pregnancy record vs baby profile).',
  })
  motherStage: MotherStageEnum;
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

  @ApiProperty({ example: '+2348012345678', nullable: true })
  phoneNumber: string | null;

  @ApiProperty({ enum: LanguageEnum, example: LanguageEnum.Igbo, nullable: true })
  language: LanguageEnum | null;

  @ApiProperty({ example: 'Enugu', nullable: true })
  state: string | null;

  @ApiProperty({ example: 'Enugu North', nullable: true })
  lga: string | null;

  @ApiProperty({ enum: MotherStageEnum, example: MotherStageEnum.Pregnant, nullable: true })
  motherStage: MotherStageEnum | null;

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
