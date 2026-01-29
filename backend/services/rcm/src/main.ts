// Load environment variables from .env.local first
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

// Initialize observability BEFORE any other imports
// This ensures proper instrumentation of all libraries
import { initializeObservability, logger, PinoLoggerService } from '@zeal/observability';
initializeObservability();

// Enable source map support for better stack traces
import 'source-map-support/register';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new PinoLoggerService(),
    bufferLogs: true,
  });

  // Enable CORS with credentials support
  app.enableCors({
    origin: true, // Reflects the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id', 'x-facility-id'],
  });

  // Enable global validation pipe with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types based on TS reflection
      },
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: false, // Don't throw error on extra properties
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3012;
  await app.listen(port);

  logger.info(
    {
      port,
      environment: process.env.NODE_ENV || 'development',
    },
    `RCM Service started successfully on http://localhost:${port}`,
  );
}

bootstrap();
