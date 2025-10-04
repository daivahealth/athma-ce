var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { PatientModule } from './modules/patient/patient.module';
import { StaffModule } from './modules/staff/staff.module';
import { FacilityModule } from './modules/facility/facility.module';
import { ClinicalModule } from './modules/clinical/clinical.module';
import { EncounterModule } from './modules/encounter/encounter.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from '@zeal/shared-database';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            DatabaseModule,
            HealthModule,
            TenantModule,
            UserModule,
            RbacModule,
            PatientModule,
            StaffModule,
            FacilityModule,
            ClinicalModule,
            EncounterModule,
            AppointmentModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map