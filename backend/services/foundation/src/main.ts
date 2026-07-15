import { config } from 'dotenv';
import { resolve } from 'path';

// This must run before importing AppModule: its database package creates a
// Prisma client during module evaluation and requires FOUNDATION_DATABASE_URL.
config({ path: resolve(__dirname, '../.env.local'), override: true });

require('source-map-support/register');
require('reflect-metadata');

// Load application modules only after the environment is available.
const { initializeObservability } = require('@zeal/observability');
initializeObservability();

const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
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

  // Global validation pipe
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

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-tenant-id',
      'x-user-id',
      'x-facility-id',
    ],
  });

  // Enhanced Swagger configuration with multi-tenancy support
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Zeal Foundation API')
    .setDescription(
      'Foundation service provides canonical master data endpoints including:\n\n' +
      '- **Tenants**: Multi-tenancy management\n' +
      '- **Users**: User accounts and profiles\n' +
      '- **Facilities**: Healthcare facilities (hospitals, clinics)\n' +
      '- **Staff**: Healthcare professionals and employees\n' +
      '- **RBAC**: Role-Based Access Control (roles, permissions)\n' +
      '- **Authentication**: Login, MFA, password management\n' +
      '- **Organizational Structure**: Departments, wards, beds, clinics\n' +
      '- **Specialties**: Medical specialties and staff assignments'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-tenant-id',
        in: 'header',
        description: 'Tenant UUID (required for most endpoints)',
      },
      'x-tenant-id'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-user-id',
        in: 'header',
        description: 'User UUID (auto-extracted from JWT in production)',
      },
      'x-user-id'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-facility-id',
        in: 'header',
        description: 'Facility UUID (required for facility-scoped operations)',
      },
      'x-facility-id'
    )
    .addServer('http://localhost:3010', 'Local Development')
    .addServer('https://api-dev.zeal.health', 'Development')
    .addServer('https://api.zeal.health', 'Production')
    .addTag('Authentication', 'Login, logout, MFA, password management')
    .addTag('Users', 'User account management')
    .addTag('Staff', 'Healthcare staff and professionals')
    .addTag('Facilities', 'Healthcare facilities (hospitals, clinics)')
    .addTag('Tenants', 'Multi-tenant organization management')
    .addTag('RBAC', 'Roles and permissions')
    .addTag('Departments', 'Hospital departments')
    .addTag('Wards', 'Hospital wards')
    .addTag('Beds', 'Hospital beds')
    .addTag('Clinics', 'Outpatient clinics')
    .addTag('Specialties', 'Medical specialties')
    .addTag('Health', 'Health check endpoints')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 3010;
  await app.listen(port);

  // Log startup info
  logger.info(
    {
      port,
      environment: process.env.NODE_ENV || 'development',
      apiDocs: `http://localhost:${port}/api/docs`,
    },
    `Foundation service started successfully on http://localhost:${port}`,
  );
}

bootstrap().catch((error) => {
  logger.fatal({ error }, 'Foundation service failed to bootstrap');
  process.exit(1);
});
