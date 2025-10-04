"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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