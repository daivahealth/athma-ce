import { Module } from '@nestjs/common';
import { RcmDatabaseModule } from '@zeal/database-rcm';
import { RequestContextModule } from '@zeal/shared-utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InsuranceModule } from './modules/insurance/insurance.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [RcmDatabaseModule, RequestContextModule, InsuranceModule, BillingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
