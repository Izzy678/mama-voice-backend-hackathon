import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

/** Matches @nestjs/swagger's swagger-ui-dist dependency. */
const SWAGGER_UI_VERSION = '5.32.6';
const SWAGGER_UI_CDN = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}`;

/**
 * Vercel serverless cannot reliably serve swagger-ui-dist static files from
 * node_modules, which causes a blank /docs page. Load assets from CDN instead.
 * @see https://stackoverflow.com/questions/77149997/when-deployed-on-vercel-my-swagger-ui-shows-a-blank-page-nodejs-nestjs-swagger
 */
function getSwaggerUiOptions(): SwaggerCustomOptions | undefined {
  const useCdn =
    process.env.VERCEL === '1' || process.env.SWAGGER_USE_CDN === 'true';

  if (!useCdn) {
    return undefined;
  }

  return {
    customCssUrl: `${SWAGGER_UI_CDN}/swagger-ui.css`,
    customJs: [
      `${SWAGGER_UI_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js`,
    ],
  };
}

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Help Mum Voice AI API')
    .setDescription('Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, getSwaggerUiOptions());
}
