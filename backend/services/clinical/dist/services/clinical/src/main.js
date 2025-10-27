"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Set global prefix for API versioning
    app.setGlobalPrefix('api/v1');
    // Enable validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    // Enable CORS with credentials support
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
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
    console.log(`🚀 Clinical Service listening on port ${port}`);
    console.log(`📝 API documentation available at http://localhost:${port}/api/v1`);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map