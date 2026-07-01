import { Module } from '@nestjs/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AiController } from './controller/ai.controller';
import { AiService } from './service/ai.service';
import { AiContextService } from './service/ai-context.service';
import { PromptBuilderService } from './service/prompt-builder.service';
import { ClaudeClient } from './service/claude.client';
import { GeminiClient } from './service/gemini.client';

@Module({
  imports: [DashboardModule],
  controllers: [AiController],
  providers: [
    AiService,
    AiContextService,
    PromptBuilderService,
    GeminiClient,
    ClaudeClient,
  ],
  exports: [AiService],
})
export class AiModule {}
