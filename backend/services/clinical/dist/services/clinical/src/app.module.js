"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const shared_utils_1 = require("@zeal/shared-utils");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const patient_module_1 = require("./modules/patient/patient.module");
const consent_module_1 = require("./modules/consent/consent.module");
const tenant_context_middleware_1 = require("./common/middleware/tenant-context.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        // Apply tenant context middleware to all routes except health check
        consumer
            .apply(tenant_context_middleware_1.TenantContextMiddleware)
            .exclude('/health', '/api/v1/health')
            .forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_clinical_1.ClinicalDatabaseModule,
            shared_utils_1.RequestContextModule,
            patient_module_1.PatientModule,
            consent_module_1.ConsentModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map