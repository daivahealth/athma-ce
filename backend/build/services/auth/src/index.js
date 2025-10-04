"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const shared_utils_1 = require("@zeal/shared-utils");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((req, _res, next) => {
        const header = req.headers['user-agent'];
        const userAgent = Array.isArray(header) ? header.join(',') : header ?? '';
        shared_utils_1.RequestContext.run({ userAgent }, () => next());
    });
    // Global validation pipe
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    // Global prefix
    app.setGlobalPrefix('api/v1/auth');
    // Enable CORS
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Auth service running on port ${port}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start auth service:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map