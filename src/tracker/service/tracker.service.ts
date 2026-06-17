import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogHealthBody } from '../dto/tracker.dto';
import { HealthTrackerEntity } from '../entity/health-tracker.entity';

@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(HealthTrackerEntity)
    private readonly healthTrackerRepository: Repository<HealthTrackerEntity>,
  ) {}

  async getHistory(userId: string) {
    const logs = await this.healthTrackerRepository.find({
      where: { userId },
      select: {
        id: true,
        logDate: true,
        weightKg: true,
        bloodPressure: true,
        nutritionNotes: true,
        symptoms: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { logDate: 'DESC' },
    });

    return { logs };
  }

  async logHealth(userId: string, body: LogHealthBody) {
    const logDate = new Date(body.logDate);

    await this.healthTrackerRepository.upsert(
      {
        userId,
        logDate,
        weightKg: body.weightKg ?? null,
        bloodPressure: body.bloodPressure ?? null,
        nutritionNotes: body.nutritionNotes ?? null,
        symptoms: body.symptoms ?? null,
      },
      { conflictPaths: ['userId', 'logDate'], skipUpdateIfNoValuesChanged: false },
    );

    const saved = await this.healthTrackerRepository.findOne({
      where: { userId, logDate },
    });

    return saved;
  }
}
