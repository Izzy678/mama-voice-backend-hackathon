import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NutritionalValues } from '../dto/food.dto';
import {
  FoodCategoryEnum,
  FoodStageEnum,
  TrimesterEnum,
} from '../enum/food.enum';

@Entity('foods')
export class FoodEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'simple-enum', enum: FoodCategoryEnum })
  category: FoodCategoryEnum;

  @Column({ type: 'text' })
  benefits: string;

  @Column({ type: 'text' })
  mamaVoiceTip: string;

  @Column({ type: 'text', nullable: true })
  dangerWarning: string | null;

  @Column({ type: 'text' })
  preparationTips: string;

  @Column({ type: 'smallint' })
  affordabilityRating: number;

  @Column({ type: 'smallint' })
  availabilityRating: number;

  @Column({ type: 'jsonb', nullable: true })
  imageUrls: string[] | null;

  @Column({ type: 'jsonb' })
  nutritionalValues: NutritionalValues;

  @Column({ type: 'simple-array' })
  suitableFor: FoodStageEnum[];

  @Column({ type: 'simple-array' })
  trimesterRecommendation: TrimesterEnum[];

  @Column({ type: 'simple-array' })
  keyNutrients: string[];

  @Column({ type: 'text' })
  servingSuggestion: string;

  @Column({ type: 'simple-array' })
  pairsWellWith: string[];

  @Column({ type: 'simple-array', nullable: true })
  avoidWith: string[] | null;

  @Column({ type: 'boolean', default: false })
  isHighIron: boolean;

  @Column({ type: 'boolean', default: false })
  isHighFolate: boolean;

  @Column({ type: 'boolean', default: false })
  isHighCalcium: boolean;

  @Column({ type: 'boolean', default: false })
  isHighProtein: boolean;

  @Column({ type: 'boolean', default: false })
  isHighVitaminC: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
