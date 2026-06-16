import { ApiProperty } from '@nestjs/swagger';

export class EnumsResponseDto {
  @ApiProperty({ example: ['Pregnant', 'New Mom'] })
  profileTypes: string[];

  @ApiProperty({ example: ['Yoruba', 'Igbo', 'Hausa'] })
  languages: string[];

  @ApiProperty({ example: ['Pregnant', 'Postpartum'] })
  motherStages: string[];

  @ApiProperty({ example: ['Vegetables', 'Legumes', 'Proteins'] })
  foodCategories: string[];

  @ApiProperty({ example: ['PREGNANT', 'POSTPARTUM', 'BOTH'] })
  foodStages: string[];

  @ApiProperty({ example: ['FIRST', 'SECOND', 'THIRD', 'ALL'] })
  trimesters: string[];

  @ApiProperty({ example: ['ios', 'android'] })
  devicePlatforms: string[];

  @ApiProperty({ example: ['Enugu', 'Lagos', 'Abuja'] })
  states: string[];

  @ApiProperty({
    example: {
      Enugu: ['Enugu North', 'Enugu South', 'Nsukka'],
      Lagos: ['Ikeja', 'Lagos Island', 'Surulere'],
    },
  })
  stateLgas: Record<string, string[]>;
}
