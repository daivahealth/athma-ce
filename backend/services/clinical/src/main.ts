import { config } from 'dotenv';
import { resolve } from 'path';

// This must run before importing AppModule: its database package creates a
// Prisma client during module evaluation and requires CLINICAL_DATABASE_URL.
config({ path: resolve(__dirname, '../.env.local'), override: true });

require('source-map-support/register');
require('reflect-metadata');

// Load application modules only after the environment is available.
const { initializeObservability } = require('@zeal/observability');
initializeObservability();

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('./app.module');
const { LoggerService } = require('./common/logger/logger.service');
const { GlobalExceptionFilter } = require('./common/filters/global-exception.filter');
const { logger } = require('./common/logger/logger.config');

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
    // Overridable for non-default dev ports/deployments (comma-separated).
    origin: process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'cache-control',
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

  logPluginSummary(app);
}

/**
 * Re-state the plugin load outcome after boot. PluginLoaderModule already logs
 * this while resolving the dynamic module, but that happens hundreds of lines
 * earlier in the startup output; repeating it here gives a single, reliable
 * place to see which plugins are live after every restart.
 */
function logPluginSummary(app: any): void {
  let loaded: Array<{ id: string; name?: string; version: string }> = [];
  let quarantined: Array<{ pluginId: string; stage: string; error: string }> = [];

  try {
    loaded = app.get('LOADED_PLUGINS', { strict: false }) ?? [];
    quarantined = app.get('QUARANTINED_PLUGINS', { strict: false }) ?? [];
  } catch {
    // Plugin loader not registered (or resolution failed) — nothing to report.
    return;
  }

  if (loaded.length === 0) {
    logger.warn({ pluginCount: 0 }, 'Plugins loaded: none');
  } else {
    logger.info(
      {
        pluginCount: loaded.length,
        plugins: loaded.map((p) => ({ id: p.id, name: p.name, version: p.version })),
      },
      `Plugins loaded (${loaded.length}): ${loaded.map((p) => `${p.id}@${p.version}`).join(', ')}`,
    );
  }

  if (quarantined.length > 0) {
    logger.error(
      {
        quarantinedCount: quarantined.length,
        quarantined: quarantined.map((q) => ({ pluginId: q.pluginId, stage: q.stage })),
      },
      `Plugins QUARANTINED (${quarantined.length}): ${quarantined
        .map((q) => `${q.pluginId} [${q.stage}]`)
        .join(', ')} — see errors above`,
    );
  }
}

bootstrap().catch((error) => {
  logger.fatal({ error }, 'Clinical service failed to bootstrap');
  // Log the raw error for better debugging (pino may not serialize non-Error objects)
  console.error('Bootstrap error details:', error);
  process.exit(1);
});
