import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupSwagger } from './utils/swagger/swagger.config';

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
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.debug(`Application is running on port ${port}`);
  Logger.debug(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();