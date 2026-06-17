import { Injectable } from '@nestjs/common';
import { EMERGENCY_KEYWORDS } from '../constants/emergency-keywords';
import { EMERGENCY_RESPONSE } from '../constants/ai-fallbacks';

@Injectable()
export class AiSafetyService {
  hasEmergencyKeywords(text: string): boolean {
    const normalized = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some((keyword) =>
      normalized.includes(keyword.toLowerCase()),
    );
  }

  getEmergencyResponse(): string {
    return EMERGENCY_RESPONSE;
  }
}
