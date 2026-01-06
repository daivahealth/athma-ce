import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './modules/patient/patient.module';
import { ConsentModule } from './modules/consent/consent.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { EncounterModule } from './modules/encounter/encounter.module';
import { ChartingModule } from './modules/charting/charting.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ValueSetModule } from './modules/valueset/valueset.module';
import { InpatientModule } from './modules/inpatient/inpatient.module';
import { BedSearchModule } from './modules/bed-search/bed-search.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { LoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    ClinicalDatabaseModule,
    RequestContextModule,
    PatientModule,
    ConsentModule,
    SchedulingModule,
    EncounterModule,
    ChartingModule,
    CatalogModule,
    ValueSetModule,
    InpatientModule,
    BedSearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService],
  exports: [LoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply request context middleware first (for AsyncLocalStorage)
    consumer.apply(RequestContextMiddleware).forRoutes('*');

    // Then apply tenant context middleware to all routes except health check
    consumer
      .apply(TenantContextMiddleware)
      .exclude('/health', '/api/v1/health')
      .forRoutes('*');
  }
}
