import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackerController } from './controller/tracker.controller';
import { HealthTrackerEntity } from './entity/health-tracker.entity';
import { TrackerService } from './service/tracker.service';

@Module({
  imports: [TypeOrmModule.forFeature([HealthTrackerEntity])],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
