import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { RequestContextModule, SharedAuthModule } from '@zeal/shared-utils';
import { ObservabilityModule } from '@zeal/observability';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './modules/patient/patient.module';
import { ConsentModule } from './modules/consent/consent.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { EncounterModule } from './modules/encounter/encounter.module';
import { ChartingModule } from './modules/charting/charting.module';
import { ObservationsModule } from './modules/observations/observations.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ValueSetModule } from './modules/valueset/valueset.module';
import { InpatientModule } from './modules/inpatient/inpatient.module';
import { BedSearchModule } from './modules/bed-search/bed-search.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { LongevityModule } from './modules/longevity/longevity.module';
import { LifestyleModule } from './modules/lifestyle/lifestyle.module';
import { DeviceSyncModule } from './modules/device-sync/device-sync.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { LabOperationsModule } from './modules/lab-operations/lab-operations.module';
import { OtModule } from './modules/ot/ot.module';
import { StorageModule } from './common/storage/storage.module';
import { PluginLoaderModule } from './common/plugins/plugin-loader.module';
import { TenantContextMiddleware } from './common/middleware/tenant-context.middleware';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { LoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    // Observability module for metrics and tracing
    ObservabilityModule.forRoot({
      excludePaths: ['/health', '/api/v1/health', '/metrics'],
    }),
    ClinicalDatabaseModule,
    RequestContextModule,
    SharedAuthModule,
    StorageModule,
    PatientModule,
    ConsentModule,
    SchedulingModule,
    EncounterModule,
    ChartingModule,
    ObservationsModule,
    CatalogModule,
    ValueSetModule,
    InpatientModule,
    BedSearchModule,
    WellnessModule,
    LongevityModule,
    LifestyleModule,
    DeviceSyncModule,
    ReportingModule,
    LabOperationsModule,
    OtModule,
    PluginLoaderModule.forRoot(),
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
