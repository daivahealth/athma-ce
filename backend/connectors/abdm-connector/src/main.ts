import { config } from 'dotenv';
import { resolve } from 'path';

// Must run before importing AppModule: the Prisma client requires
// ABDM_DATABASE_URL at module evaluation.
config({ path: resolve(__dirname, '../.env.local'), override: true });

require('source-map-support/register');
require('reflect-metadata');

const { initializeObservability } = require('@zeal/observability');
initializeObservability();

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe, Logger } = require('@nestjs/common');
const { AppModule } = require('./app.module');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }),
  );

  const port = process.env.PORT || 3016;
  await app.listen(port);
  Logger.log(`ABDM connector listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
