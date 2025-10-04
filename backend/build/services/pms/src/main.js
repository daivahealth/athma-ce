import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RequestContext } from '@zeal/shared-utils';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('PMS Service');
    app.use((req, _res, next) => {
        const header = req.headers['user-agent'];
        const userAgent = Array.isArray(header) ? header.join(',') : header ?? '';
        RequestContext.run({ userAgent }, () => next());
    });
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    // CORS configuration
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
        credentials: true,
    });
    // Global prefix
    app.setGlobalPrefix('api/v1/pms');
    // Ensure DI & routes are fully wired before Swagger scans
    await app.init();
    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Zeal PMS API')
        .setDescription('Practice Management System API for Zeal Healthcare Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Tenants', 'Tenant management operations')
        .addTag('Users', 'User management operations')
        .addTag('RBAC', 'Role-based access control operations')
        .addTag('Patients', 'Patient management operations')
        .addTag('Staff', 'Staff management operations')
        .addTag('Facilities', 'Facility management operations')
        .addTag('Clinical', 'Clinical operations')
        .build();
    // deepScanRoutes makes Swagger walk through dynamically registered/lazy routes
    const document = SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
    });
    SwaggerModule.setup('api/v1/pms/docs', app, document);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    logger.log(`🚀 PMS Service is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api/v1/pms/docs`);
    logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/pms/health`);
}
bootstrap().catch((error) => {
    console.error('Failed to start PMS Service:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map