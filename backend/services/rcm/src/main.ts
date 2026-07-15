import { config } from 'dotenv';
import { resolve } from 'path';

// This must run before importing AppModule: its database package creates a
// Prisma client during module evaluation and requires RCM_DATABASE_URL.
config({ path: resolve(__dirname, '../.env.local'), override: true });

require('source-map-support/register');
require('reflect-metadata');

// Load application modules only after the environment is available.
const { initializeObservability, logger, PinoLoggerService } = require('@zeal/observability');
initializeObservability();

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('./app.module');

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
