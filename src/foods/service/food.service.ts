import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FOOD_SEED_DATA, FoodItem } from '../data/food.seed';
import { FoodEntity } from '../entity/food.entity';
import { FoodStageEnum } from '../enum/food.enum';

const DEFAULT_FOOD_IMAGE_URL =
  'https://res.cloudinary.com/djnl9luvi/image/upload/v1781598746/default-image_zuz3ag.webp';

const FOOD_PUBLIC_SELECT = {
  id: true,
  name: true,
  category: true,
  benefits: true,
  mamaVoiceTip: true,
  dangerWarning: true,
  preparationTips: true,
  affordabilityRating: true,
  availabilityRating: true,
  imageUrls: true,
  nutritionalValues: true,
  suitableFor: true,
  trimesterRecommendation: true,
  keyNutrients: true,
  servingSuggestion: true,
  pairsWellWith: true,
  avoidWith: true,
  isHighIron: true,
  isHighFolate: true,
  isHighCalcium: true,
  isHighProtein: true,
  isHighVitaminC: true,
} as const;

@Injectable()
export class FoodService implements OnModuleInit {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodRepository: Repository<FoodEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.foodRepository.count();

    if (count !== FOOD_SEED_DATA.length) {
      await this.foodRepository.clear();
      const foods = FOOD_SEED_DATA.map((item) =>
        this.foodRepository.create(this.toEntity(item)),
      );
      await this.foodRepository.save(foods);
      return;
    }

    await this.foodRepository
      .createQueryBuilder()
      .update(FoodEntity)
      .set({ imageUrls: [DEFAULT_FOOD_IMAGE_URL] })
      .where('imageUrls IS NULL OR imageUrls = :empty', { empty: '[]' })
      .execute();
  }

  async findAll(stage?: 'PREGNANT' | 'POSTPARTUM') {
    const foods = await this.foodRepository.find({
      where: { isActive: true },
      select: FOOD_PUBLIC_SELECT,
      order: { category: 'ASC', name: 'ASC' },
    });

    const filtered = stage ? this.filterByStage(foods, stage) : foods;

    return { foods: filtered };
  }

  private toEntity(item: FoodItem): Partial<FoodEntity> {
    return {
      name: item.name,
      category: item.category,
      benefits: item.benefits,
      mamaVoiceTip: item.mamaVoiceTip,
      dangerWarning: item.dangerWarning,
      preparationTips: item.preparationTips,
      affordabilityRating: item.affordabilityRating,
      availabilityRating: item.availabilityRating,
      imageUrls:
        item.imageUrl && item.imageUrl.length > 0
          ? item.imageUrl
          : [DEFAULT_FOOD_IMAGE_URL],
      nutritionalValues: item.nutritionalValues,
      suitableFor: item.suitableFor,
      trimesterRecommendation: item.trimesterRecommendation,
      keyNutrients: item.keyNutrients,
      servingSuggestion: item.servingSuggestion,
      pairsWellWith: item.pairsWellWith,
      avoidWith: item.avoidWith,
      isHighIron: item.isHighIron,
      isHighFolate: item.isHighFolate,
      isHighCalcium: item.isHighCalcium,
      isHighProtein: item.isHighProtein,
      isHighVitaminC: item.isHighVitaminC,
    };
  }

  private filterByStage(foods: FoodEntity[], stage: 'PREGNANT' | 'POSTPARTUM') {
    const stageEnum =
      stage === 'PREGNANT' ? FoodStageEnum.Pregnant : FoodStageEnum.Postpartum;

    return foods.filter(
      (food) =>
        food.suitableFor.includes(FoodStageEnum.Both) ||
        food.suitableFor.includes(stageEnum),
    );
  }
}
