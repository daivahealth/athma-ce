import { Module } from '@nestjs/common';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { RequestContextModule, SharedAuthModule, JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';
import { APP_GUARD } from '@nestjs/core';
import { TenantContextGuard } from './common/guards/tenant-context.guard';
import { ObservabilityModule } from '@zeal/observability';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { BillingModule } from './modules/billing/billing.module';
import { MedicalCodingModule } from './modules/medical-coding/medical-coding.module';
import { CatalogMappingModule } from './modules/catalog-mappings/catalog-mapping.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { DenialsModule } from './modules/denials/denials.module';
import { BatchesModule } from './modules/batches/batches.module';
import { EligibilityModule } from './modules/eligibility/eligibility.module';
import { PreAuthModule } from './modules/preauth/preauth.module';
import { RemittanceModule } from './modules/remittance/remittance.module';
import { MembershipModule } from './modules/membership/membership.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';

@Module({
  imports: [
    // Observability module for metrics and tracing
    ObservabilityModule.forRoot({
      excludePaths: ['/health', '/api/v1/health', '/metrics'],
    }),
    RcmDatabaseModule,
    RequestContextModule,
    SharedAuthModule,
    InsuranceModule,
    BillingModule,
    MedicalCodingModule,
    CatalogMappingModule,
    ClaimsModule,
    DenialsModule,
    BatchesModule,
    EligibilityModule,
    PreAuthModule,
    RemittanceModule,
    MembershipModule,
    PharmacyModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    // Service-wide auth (issue #73): every route requires a valid JWT unless
    // marked @Public; @Permissions is enforced where declared; and the
    // x-tenant-id/x-user-id headers RCM controllers read are bound to the
    // authenticated JWT (spoofed tenants rejected). Order matters.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_GUARD, useClass: TenantContextGuard },
  ],
})
export class AppModule { }
