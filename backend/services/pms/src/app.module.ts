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

@Module({
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
export class AppModule {}