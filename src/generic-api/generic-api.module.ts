import { Module } from '@nestjs/common';
import { GenericApiController } from './controller/generic-api.controller';
import { GenericApiService } from './service/generic-api.service';

@Module({
  controllers: [GenericApiController],
  providers: [GenericApiService],
})
export class GenericApiModule {}
