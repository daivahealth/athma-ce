"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS for frontend
    app.enableCors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Zeal Foundation API')
        .setDescription('Canonical master data endpoints (tenants, facilities, staff, RBAC)')
        .setVersion('0.1')
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, swaggerDocument);
    const port = process.env.PORT || 3010;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`Foundation service listening on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Foundation service failed to bootstrap', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map