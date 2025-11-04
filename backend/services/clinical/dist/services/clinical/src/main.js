"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Enable source map support for better stack traces
require("source-map-support/register");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const logger_service_1 = require("./common/logger/logger.service");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const logger_config_1 = require("./common/logger/logger.config");
async function bootstrap() {
    // Create app with custom logger
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.LoggerService(),
        bufferLogs: true,
    });
    // Global exception filter (must be first)
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    // Set global prefix for API versioning
    app.setGlobalPrefix('api/v1');
    // Enable validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
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
    logger_config_1.logger.info({
        port,
        environment: process.env.NODE_ENV || 'development',
    }, `Clinical service started successfully on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    logger_config_1.logger.fatal({ error }, 'Clinical service failed to bootstrap');
    process.exit(1);
});
//# sourceMappingURL=main.js.map