import { Injectable } from '@nestjs/common';
import { AiIntent } from '../enum/ai.enum';
import { VACCINATION_KEYWORDS } from '../constants/vaccination-keywords';
import { MotherStageEnum } from '../../user/enum/user.enum';

@Injectable()
export class AiRouterService {
  classifyIntent(
    textQuery: string,
    motherStage: MotherStageEnum | null,
  ): AiIntent {
    const normalized = textQuery.toLowerCase();
    const hasVaccinationSignal = VACCINATION_KEYWORDS.some((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    );

    if (hasVaccinationSignal) {
      return AiIntent.VAXLLAMA;
    }

    if (motherStage === MotherStageEnum.Pregnant) {
      return AiIntent.MAMABOT;
    }

    return AiIntent.MAMABOT;
  }
}
