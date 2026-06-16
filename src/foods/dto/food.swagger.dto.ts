import { ApiProperty } from '@nestjs/swagger';
import {
  FoodCategoryEnum,
  FoodStageEnum,
  TrimesterEnum,
} from '../enum/food.enum';

export class NutritionalValuesDto {
  @ApiProperty({ example: 32 })
  calories: number;

  @ApiProperty({ example: 4.5 })
  protein: number;

  @ApiProperty({ example: 5.0 })
  carbs: number;

  @ApiProperty({ example: 0.5 })
  fat: number;

  @ApiProperty({ example: 2.5 })
  fiber: number;

  @ApiProperty({ example: 180 })
  sodium: number;

  @ApiProperty({ example: 3.5 })
  iron: number;

  @ApiProperty({ example: 120 })
  calcium: number;

  @ApiProperty({ example: 30 })
  vitaminC: number;

  @ApiProperty({ example: 80 })
  folate: number;

  @ApiProperty({ example: 380 })
  vitaminA: number;

  @ApiProperty({ example: 0.6 })
  zinc: number;
}

export class FoodItemDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'Fluted Pumpkin Leaves' })
  name: string;

  @ApiProperty({ enum: FoodCategoryEnum, example: FoodCategoryEnum.Vegetables })
  category: FoodCategoryEnum;

  @ApiProperty({ example: 'Rich in iron and folate...' })
  benefits: string;

  @ApiProperty({ example: 'Eat this soup at least three times a week...' })
  mamaVoiceTip: string;

  @ApiProperty({ example: null, nullable: true })
  dangerWarning: string | null;

  @ApiProperty({ example: 'Wash leaves thoroughly before cooking...' })
  preparationTips: string;

  @ApiProperty({ example: 1, description: '1 = very affordable, 3 = expensive' })
  affordabilityRating: number;

  @ApiProperty({ example: 1, description: '1 = widely available, 3 = rare' })
  availabilityRating: number;

  @ApiProperty({ example: ['https://example.com/food.jpg'], nullable: true })
  imageUrls: string[] | null;

  @ApiProperty({ type: NutritionalValuesDto })
  nutritionalValues: NutritionalValuesDto;

  @ApiProperty({ enum: FoodStageEnum, isArray: true })
  suitableFor: FoodStageEnum[];

  @ApiProperty({ enum: TrimesterEnum, isArray: true })
  trimesterRecommendation: TrimesterEnum[];

  @ApiProperty({ example: ['Iron', 'Folate', 'Vitamin A'] })
  keyNutrients: string[];

  @ApiProperty({ example: 'A generous handful (about 100g) in daily soup.' })
  servingSuggestion: string;

  @ApiProperty({ example: ['Smoked Fish', 'Palm Oil'] })
  pairsWellWith: string[];

  @ApiProperty({ example: null, nullable: true })
  avoidWith: string[] | null;

  @ApiProperty({ example: true })
  isHighIron: boolean;

  @ApiProperty({ example: true })
  isHighFolate: boolean;

  @ApiProperty({ example: false })
  isHighCalcium: boolean;

  @ApiProperty({ example: false })
  isHighProtein: boolean;

  @ApiProperty({ example: false })
  isHighVitaminC: boolean;
}

export class FoodsListResponseDto {
  @ApiProperty({ type: [FoodItemDto] })
  foods: FoodItemDto[];
}
