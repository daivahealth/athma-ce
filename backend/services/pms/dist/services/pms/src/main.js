"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3002;
    await app.listen(port);
    // eslint-disable-next-line no-console
    console.log(`PMS service running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap PMS service', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map