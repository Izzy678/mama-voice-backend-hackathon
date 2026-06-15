import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginAuditEntity } from './entity/login-audit.entity';
import { LoginAuditService } from './service/login-audit.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([LoginAuditEntity])
  ],
  providers: [LoginAuditService],
  exports: [LoginAuditService],
})
export class LoginAuditModule {}
