import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { UserTokenMiddleware } from './utils/middleware/token.middleware';
import { envEnum } from './utils/enum/env.enum';
import { LoginAuditModule } from './login-audit/login-audit.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(process.cwd(), '.env'),
        '.env',
      ],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>(envEnum.DATABASE_URL),
        autoLoadEntities: true,
        synchronize: configService.get(envEnum.NODE_ENV) !== 'production',
     //   logging: configService.get(envEnum.NODE_ENV) === 'development',
        ssl: { rejectUnauthorized: true },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DeviceModule,
    EmailModule,
    UserModule,
    LoginAuditModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserTokenMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserTokenMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
 }
