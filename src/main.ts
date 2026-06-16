import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './utils/swagger/swagger.config';
import { ResponseInterceptor } from './utils/interceptor/response.interceptor';
import { GlobalExceptionFilter } from './utils/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization, x-device-id',
    );
    next();
  });
  app.enableCors({
    credentials: true,
    origin: true,
    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.debug(`Application is running on port ${port}`);
  Logger.debug(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
