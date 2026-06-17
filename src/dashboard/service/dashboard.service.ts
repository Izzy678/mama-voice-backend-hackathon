import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { MotherStageEnum } from '../../user/enum/user.enum';
import { NIGERIA_VACCINE_SCHEDULE } from '../../vaccines/constants/vaccine-schedule';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class DashboardService {
    constructor(private readonly userService: UserService) { }

    async getDashboard(userId: string) {
        const user = await this.userService.find({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.motherStage || !user.targetDate) {
            throw new BadRequestException('Profile is incomplete. Please set your profile first.');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(user.targetDate);
        targetDate.setHours(0, 0, 0, 0);

        if (user.motherStage === MotherStageEnum.Pregnant) {
            return this.buildPregnantDashboard(user.firstName, today, targetDate);
        }

        return this.buildPostpartumDashboard(user.firstName, today, targetDate);
    }

    private buildPregnantDashboard(
        firstName: string | null,
        today: Date,
        dueDate: Date,
    ) {
        const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / MS_PER_DAY);
        const pregnancyWeek = Math.max(1, Math.min(40, 40 - Math.ceil(daysUntilDue / 7)));

        return {
            firstName: firstName ?? '',
            statusText: `You are ${pregnancyWeek} weeks pregnant`,
            currentWeek: pregnancyWeek,
            daysToNextVaccine: Math.max(0, daysUntilDue),
            nextVaccineName: 'BCG, OPV 0 & Hepatitis B (at birth)',
        };
    }

    private buildPostpartumDashboard(
        firstName: string | null,
        today: Date,
        birthDate: Date,
    ) {
        const babyAgeDays = Math.round((today.getTime() - birthDate.getTime()) / MS_PER_DAY);
        const babyAgeWeeks = Math.floor(babyAgeDays / 7);

        const nextVaccine = NIGERIA_VACCINE_SCHEDULE.find((v) => v.weekAge > babyAgeWeeks);

        let daysToNextVaccine: number | null = null;
        let nextVaccineName: string | null = null;

        if (nextVaccine) {
            const nextDue = new Date(birthDate);
            nextDue.setDate(nextDue.getDate() + nextVaccine.weekAge * 7);
            daysToNextVaccine = Math.max(0, Math.round((nextDue.getTime() - today.getTime()) / MS_PER_DAY));
            nextVaccineName = nextVaccine.vaccineName;
        }

        return {
            firstName: firstName ?? '',
            statusText: `Your baby is ${babyAgeWeeks} weeks old`,
            currentWeek: babyAgeWeeks,
            daysToNextVaccine,
            nextVaccineName,
        };
    }
}
