import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaccineController } from './controller/vaccine.controller';
import { VaccineTrackerEntity } from './entity/vaccine-tracker.entity';
import { VaccineService } from './service/vaccine.service';

@Module({
  imports: [TypeOrmModule.forFeature([VaccineTrackerEntity])],
  controllers: [VaccineController],
  providers: [VaccineService],
})
export class VaccineModule {}
