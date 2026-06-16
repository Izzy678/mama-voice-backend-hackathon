import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodController } from './controller/food.controller';
import { FoodEntity } from './entity/food.entity';
import { FoodService } from './service/food.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodEntity])],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
