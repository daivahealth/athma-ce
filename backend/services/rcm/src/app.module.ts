import { Module } from '@nestjs/common';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { BillingModule } from './modules/billing/billing.module';
import { MedicalCodingModule } from './modules/medical-coding/medical-coding.module';

@Module({
  imports: [RcmDatabaseModule, RequestContextModule, InsuranceModule, BillingModule, MedicalCodingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
