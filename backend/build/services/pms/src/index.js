import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// 👇 imports for the detector
import { ModulesContainer, MetadataScanner } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
async function bootstrap() {
    const logger = new Logger('PMS Service');
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    // Global validation
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    // Global prefix + CORS
    app.setGlobalPrefix('api/v1/pms');
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
    });
    // Ensure all routes/providers are wired
    await app.init();
    // ---- DETECTOR: find handlers missing runtime param metadata ----
    try {
        const modules = app.get(ModulesContainer);
        const scanner = new MetadataScanner();
        let issues = 0;
        for (const [, moduleRef] of modules.entries()) {
            for (const [, wrapper] of moduleRef.controllers) {
                const instance = wrapper.instance;
                if (!instance)
                    continue;
                const proto = Object.getPrototypeOf(instance);
                scanner.scanFromPrototype(instance, proto, (methodName) => {
                    const handler = proto[methodName];
                    if (typeof handler !== 'function')
                        return;
                    const paramTypes = Reflect.getMetadata('design:paramtypes', handler);
                    if (!paramTypes) {
                        issues++;
                        const ctrlPath = Reflect.getMetadata(PATH_METADATA, proto.constructor) ?? '';
                        const methodPath = Reflect.getMetadata(PATH_METADATA, handler) ?? '';
                        const requestMethod = Reflect.getMetadata(METHOD_METADATA, handler);
                        logger.debug(`Missing design:paramtypes → controller=${proto.constructor?.name} method=${methodName} route=${ctrlPath}/${methodPath} requestMethod=${requestMethod}`);
                    }
                });
            }
        }
        if (issues === 0) {
            logger.log('Detector: no missing param metadata found.');
        }
        else {
            logger.warn(`Detector: found ${issues} handler(s) missing param metadata.`);
            logger.debug('Missing parameter metadata details can be found in the debug logs above.');
        }
    }
    catch (e) {
        logger.warn(`Detector failed: ${e.message}`);
    }
    // ---- /DETECTOR ----
    // ---- SAFE SWAGGER (won’t crash the app) ----
    try {
        const config = new DocumentBuilder()
            .setTitle('Zeal PMS API')
            .setDescription('Practice Management System API for Zeal Healthcare Platform')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Health', 'Health check endpoints')
            .addTag('Tenants', 'Tenant management operations')
            .addTag('Users', 'User management operations')
            .addTag('RBAC', 'Role-based access control operations')
            .addTag('Patients', 'Patient management operations')
            .addTag('Staff', 'Staff management operations')
            .addTag('Facilities', 'Facility management operations')
            .addTag('Clinical', 'Clinical operations')
            .build();
        const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
        // Only mount if routes were discovered
        if (Object.keys(document.paths ?? {}).length > 0) {
            SwaggerModule.setup('api/v1/pms/docs', app, document);
            logger.log('📚 Swagger mounted at /api/v1/pms/docs');
        }
        else {
            logger.warn('Swagger skipped: no routes discovered.');
        }
    }
    catch (err) {
        logger.error(`Swagger disabled due to error: ${err.message}`);
    }
    // ---- /SAFE SWAGGER ----
    const port = Number(process.env.PORT ?? 3002);
    await app.listen(port);
    logger.log(`🚀 PMS Service running: http://localhost:${port}`);
    logger.log(`🏥 Health:              http://localhost:${port}/api/v1/pms/health`);
}
bootstrap().catch((error) => {
    // last-resort guard
    // eslint-disable-next-line no-console
    console.error('Failed to start PMS service:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map