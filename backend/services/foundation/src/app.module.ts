import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
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
import { StaffModule } from './modules/staff/staff.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule as AppConfigModule } from './modules/config/config.module';
import { ValueSetModule } from './modules/valueset/valueset.module';
import { SpaceModule } from './modules/space/space.module';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { LoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] }),
    FoundationDatabaseModule,
    RequestContextModule,
    AuthModule,
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
    StaffModule,
    AppConfigModule,
    ValueSetModule,
    SpaceModule,
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply request context middleware to all routes
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
