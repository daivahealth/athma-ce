"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('PMS Service');
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
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
    // Swagger documentation
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/pms/docs', app, document);
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
//# sourceMappingURL=main.js.map