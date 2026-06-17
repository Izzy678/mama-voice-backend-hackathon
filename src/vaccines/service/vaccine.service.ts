import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from '../../user/service/user.service';
import { MotherStageEnum } from '../../user/enum/user.enum';
import { NIGERIA_VACCINE_SCHEDULE } from '../constants/vaccine-schedule';
import { VaccineTrackerEntity } from '../entity/vaccine-tracker.entity';
import { LogVaccineBody } from '../dto/vaccine.dto';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class VaccineService {
  constructor(
    @InjectRepository(VaccineTrackerEntity)
    private readonly vaccineTrackerRepository: Repository<VaccineTrackerEntity>,
    private readonly userService: UserService,
  ) {}

  async getVaccines(userId: string) {
    const user = await this.userService.find({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    if (!user.motherStage || !user.targetDate) {
      throw new BadRequestException('Profile is incomplete. Please set your profile first.');
    }

    const isPregnant = user.motherStage === MotherStageEnum.Pregnant;
    const birthDate = new Date(user.targetDate);
    birthDate.setHours(0, 0, 0, 0);

    const existingRows = await this.vaccineTrackerRepository.find({
      where: { userId },
      select: { vaccineId: true, isCompleted: true, administeredDate: true, sideEffects: true, id: true },
    });

    const existingMap = new Map(existingRows.map((r) => [r.vaccineId, r]));

    const toCreate = NIGERIA_VACCINE_SCHEDULE.filter(
      (entry) => !existingMap.has(entry.vaccineId),
    ).map((entry) =>
      this.vaccineTrackerRepository.create({
        userId,
        vaccineId: entry.vaccineId,
        vaccineName: entry.vaccineName,
        dueDateString: entry.dueDateString,
        isCompleted: false,
        administeredDate: null,
        sideEffects: null,
      }),
    );

    if (toCreate.length > 0) {
      const saved = await this.vaccineTrackerRepository.save(toCreate);
      saved.forEach((r) => existingMap.set(r.vaccineId, r));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const vaccines = NIGERIA_VACCINE_SCHEDULE.map((entry) => {
      const row = existingMap.get(entry.vaccineId);

      let dueDate: string | null = null;
      if (!isPregnant) {
        const dueDateObj = new Date(birthDate);
        dueDateObj.setDate(dueDateObj.getDate() + entry.weekAge * 7);
        dueDate = dueDateObj.toISOString().split('T')[0];
      }

      return {
        vaccineId: entry.vaccineId,
        vaccineName: entry.vaccineName,
        dueDateString: entry.dueDateString,
        dueDate,
        isCompleted: row?.isCompleted ?? false,
        administeredDate: row?.administeredDate
          ? new Date(row.administeredDate).toISOString().split('T')[0]
          : null,
        sideEffects: row?.sideEffects ?? null,
      };
    });

    return { vaccines };
  }

  async logVaccine(userId: string, body: LogVaccineBody) {
    const scheduleEntry = NIGERIA_VACCINE_SCHEDULE.find(
      (e) => e.vaccineId === body.vaccineId,
    );
    if (!scheduleEntry) {
      throw new NotFoundException(`Vaccine ID '${body.vaccineId}' not found in the schedule`);
    }

    let tracker = await this.vaccineTrackerRepository.findOne({
      where: { userId, vaccineId: body.vaccineId },
    });

    if (!tracker) {
      tracker = this.vaccineTrackerRepository.create({
        userId,
        vaccineId: scheduleEntry.vaccineId,
        vaccineName: scheduleEntry.vaccineName,
        dueDateString: scheduleEntry.dueDateString,
      });
    }

    tracker.vaccineName = body.vaccineName ?? scheduleEntry.vaccineName;
    tracker.isCompleted = body.isCompleted ?? true;
    tracker.administeredDate = new Date(body.administeredDate);
    tracker.sideEffects = body.sideEffects ?? null;

    const saved = await this.vaccineTrackerRepository.save(tracker);

    return {
      id: saved.id,
      vaccineId: saved.vaccineId,
      vaccineName: saved.vaccineName,
      isCompleted: saved.isCompleted,
      administeredDate: saved.administeredDate
        ? new Date(saved.administeredDate).toISOString().split('T')[0]
        : null,
      sideEffects: saved.sideEffects,
      updatedAt: saved.updatedAt,
    };
  }
}
