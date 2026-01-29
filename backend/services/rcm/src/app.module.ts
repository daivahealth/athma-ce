import { Module } from '@nestjs/common';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { RequestContextModule } from '@zeal/shared-utils';
import { ObservabilityModule } from '@zeal/observability';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { BillingModule } from './modules/billing/billing.module';
import { MedicalCodingModule } from './modules/medical-coding/medical-coding.module';
import { CatalogMappingModule } from './modules/catalog-mappings/catalog-mapping.module';

@Module({
  imports: [
    // Observability module for metrics and tracing
    ObservabilityModule.forRoot({
      excludePaths: ['/health', '/api/v1/health', '/metrics'],
    }),
    RcmDatabaseModule,
    RequestContextModule,
    InsuranceModule,
    BillingModule,
    MedicalCodingModule,
    CatalogMappingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
