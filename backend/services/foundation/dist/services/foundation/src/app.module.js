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
const config_1 = require("@nestjs/config");
const database_foundation_1 = require("@zeal/database-foundation");
const shared_utils_1 = require("@zeal/shared-utils");
const health_module_1 = require("./modules/health/health.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const user_module_1 = require("./modules/user/user.module");
const facility_module_1 = require("./modules/facility/facility.module");
const user_facility_module_1 = require("./modules/user-facility/user-facility.module");
const department_module_1 = require("./modules/department/department.module");
const ward_module_1 = require("./modules/ward/ward.module");
const bed_module_1 = require("./modules/bed/bed.module");
const clinic_module_1 = require("./modules/clinic/clinic.module");
const specialty_module_1 = require("./modules/specialty/specialty.module");
const staff_module_1 = require("./modules/staff/staff.module");
const auth_module_1 = require("./modules/auth/auth.module");
const config_module_1 = require("./modules/config/config.module");
const valueset_module_1 = require("./modules/valueset/valueset.module");
const request_context_middleware_1 = require("./common/middleware/request-context.middleware");
const logger_service_1 = require("./common/logger/logger.service");
let AppModule = class AppModule {
    configure(consumer) {
        // Apply request context middleware to all routes
        consumer.apply(request_context_middleware_1.RequestContextMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
            database_foundation_1.FoundationDatabaseModule,
            shared_utils_1.RequestContextModule,
            auth_module_1.AuthModule,
            health_module_1.HealthModule,
            tenant_module_1.TenantModule,
            user_module_1.UserModule,
            facility_module_1.FacilityModule,
            user_facility_module_1.UserFacilityModule,
            department_module_1.DepartmentModule,
            ward_module_1.WardModule,
            bed_module_1.BedModule,
            clinic_module_1.ClinicModule,
            specialty_module_1.SpecialtyModule,
            staff_module_1.StaffModule,
            config_module_1.ConfigModule,
            valueset_module_1.ValueSetModule,
        ],
        providers: [logger_service_1.LoggerService],
        exports: [logger_service_1.LoggerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map