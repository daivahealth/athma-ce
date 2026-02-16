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
import { ClaimsModule } from './modules/claims/claims.module';
import { BatchesModule } from './modules/batches/batches.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { PreAuthModule } from './modules/preauth/preauth.module';
import { RemittanceModule } from './modules/remittance/remittance.module';
import { MembershipModule } from './modules/membership/membership.module';

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
    ClaimsModule,
    BatchesModule,
    EligibilityModule,
    PreAuthModule,
    RemittanceModule,
    MembershipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
