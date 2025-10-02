import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('PMS Service');
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    // Global prefix
    app.setGlobalPrefix('api/v1/pms');
    // Enable CORS
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });
    // Swagger documentation
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
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/pms/docs', app, document);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    logger.log(`🚀 PMS Service is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api/v1/pms/docs`);
    logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/pms/health`);
}
bootstrap().catch((error) => {
    console.error('Failed to start PMS service:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map