// Enable source map support for better stack traces
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { LoggerService } from './common/logger/logger.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { logger } from './common/logger/logger.config';

async function bootstrap() {
  // Create app with custom logger
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
    bufferLogs: true,
  });

  // Global exception filter (must be first)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS with credentials support
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'x-user-id',
      'x-facility-id',
    ],
  });

  const port = process.env.PORT ?? 3011;

  await app.listen(port);

  // Log startup info
  logger.info(
    {
      port,
      environment: process.env.NODE_ENV || 'development',
    },
    `Clinical service started successfully on http://localhost:${port}`,
  );
}

bootstrap().catch((error) => {
  logger.fatal({ error }, 'Clinical service failed to bootstrap');
  process.exit(1);
});
