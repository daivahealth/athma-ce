/**
 * NestJS Application Bootstrap
 * Replaces Express index.ts
 */

import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve(__dirname, '../.env.local') });

import { initializeObservability, PinoLoggerService, logger } from '@zeal/observability';
initializeObservability();

// Enable source map support for better stack traces
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerService(),
    bufferLogs: true,
  });

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3013);
  const env = configService.get<string>('env', 'development');

  // Global prefix (optional - keep /v1 in controllers instead)
  // app.setGlobalPrefix('v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert string to number, etc.
      },
    }),
  );

  // Global exception filter (optional - for custom error format)
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors();

  // Swagger/OpenAPI setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Zeal PRM API')
    .setDescription('Patient Relationship Management API for engagement workflows')
    .setVersion('1.0.0')
    .setContact('Zeal Health', 'https://zeal.health', 'api@zeal.health')
    .addServer('http://localhost:3013', 'Development server')
    .addServer('https://api.zeal.health/prm', 'Production server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'OIDC JWT token with tenant_id and user_id claims',
      },
      'bearer',
    )
    .addTag('System', 'System endpoints')
    .addTag('Events', 'Event ingestion')
    .addTag('Rules', 'Rules management')
    .addTag('Templates', 'Communication templates')
    .addTag('Patients', 'Patient data')
    .addTag('Tasks', 'Patient tasks')
    .addTag('Providers', 'Provider callbacks')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // Start server
  await app.listen(port);

  logger.info(`PRM service started on port ${port} (${env})`, 'Bootstrap');
  logger.info(`Swagger docs available at http://localhost:${port}/api-docs`, 'Bootstrap');
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to start application');
  process.exit(1);
});
