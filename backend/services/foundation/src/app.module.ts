import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@zeal/shared-database';
import { RequestContextModule } from '@zeal/shared-utils';
import { HealthModule } from './modules/health/health.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { UserModule } from './modules/user/user.module';
import { FacilityModule } from './modules/facility/facility.module';
import { UserFacilityModule } from './modules/user-facility/user-facility.module';
import { DepartmentModule } from './modules/department/department.module';
import { WardModule } from './modules/ward/ward.module';
import { BedModule } from './modules/bed/bed.module';
import { ClinicModule } from './modules/clinic/clinic.module';
import { SpecialtyModule } from './modules/specialty/specialty.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    DatabaseModule,
    RequestContextModule,
    HealthModule,
    TenantModule,
    UserModule,
    FacilityModule,
    UserFacilityModule,
    DepartmentModule,
    WardModule,
    BedModule,
    ClinicModule,
    SpecialtyModule,
  ],
})
export class AppModule {}
