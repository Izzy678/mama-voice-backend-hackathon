import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AiController } from './controller/ai.controller';
import { AiService } from './service/ai.service';
import { AiSafetyService } from './service/ai-safety.service';
import { AiRouterService } from './service/ai-router.service';
import { AiContextService } from './service/ai-context.service';
import { HfInferenceClient } from './service/hf-inference.client';
import { ClaudeClient } from './service/claude.client';
import { GeminiClient } from './service/gemini.client';

@Module({
  imports: [DashboardModule],
  controllers: [AiController],
  providers: [
    AiService,
    AiSafetyService,
    AiRouterService,
    AiContextService,
    HfInferenceClient,
    GeminiClient,
    ClaudeClient,
  ],
})
export class AiModule {}
