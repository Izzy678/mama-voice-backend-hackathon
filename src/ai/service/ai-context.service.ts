import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { DashboardService } from '../../dashboard/service/dashboard.service';
import {
  type AiPromptContext,
  resolveTrimester,
} from '../constants/ai-prompts';
import { MotherStageEnum } from '../../user/enum/user.enum';

@Injectable()
export class AiContextService {
  constructor(
    private readonly userService: UserService,
    private readonly dashboardService: DashboardService,
  ) {}

  async buildContext(userId: string): Promise<AiPromptContext> {
    const user = await this.userService.find({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.motherStage || !user.targetDate) {
      throw new BadRequestException(
        'Profile is incomplete. Please set your profile first.',
      );
    }

    const dashboard = await this.dashboardService.getDashboard(userId);
    const currentWeek = dashboard.currentWeek ?? null;
    const trimester =
      user.motherStage === MotherStageEnum.Pregnant && currentWeek != null
        ? resolveTrimester(currentWeek)
        : null;

    return {
      firstName: user.firstName ?? 'Mother',
      motherStage: user.motherStage,
      state: user.state ?? '',
      lga: user.lga ?? '',
      statusText: dashboard.statusText,
      currentWeek,
      trimester,
      nextVaccineName: dashboard.nextVaccineName,
      daysToNextVaccine: dashboard.daysToNextVaccine,
    };
  }
}
