import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';
import { VoiceController } from './controller/voice.controller';
import { VoiceService } from './service/voice.service';
import { YarngptClient } from './service/yarngpt.client';
import { SpitchTtsClient } from './service/spitch-tts.client';
import { TtsService } from './service/tts.service';
import { SttService } from './service/stt.service';
import { GeminiSttClient } from './service/gemini-stt.client';
import { SpitchSttClient } from './service/spitch-stt.client';

@Module({
  imports: [AiModule, UserModule],
  controllers: [VoiceController],
  providers: [
    VoiceService,
    YarngptClient,
    SpitchTtsClient,
    TtsService,
    SttService,
    GeminiSttClient,
    SpitchSttClient,
  ],
})
export class VoiceModule {}
