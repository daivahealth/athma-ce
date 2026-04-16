import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

// Controllers
import { PharmacyQueueController } from './controllers/pharmacy-queue.controller';
import { PharmacyDispensingController } from './controllers/pharmacy-dispensing.controller';
import { PharmacyStockController } from './controllers/pharmacy-stock.controller';
import { PharmacyStockMovementController } from './controllers/pharmacy-stock-movement.controller';

// Services
import { PharmacyQueueService } from './services/pharmacy-queue.service';
import { PharmacyDispensingService } from './services/pharmacy-dispensing.service';
import { PharmacyStockService } from './services/pharmacy-stock.service';
import { PharmacyChargeService } from './services/pharmacy-charge.service';

// Dependencies from Billing module
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    BillingModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    PharmacyQueueController,
    PharmacyDispensingController,
    PharmacyStockController,
    PharmacyStockMovementController,
  ],
  providers: [
    PrismaService,
    PharmacyQueueService,
    PharmacyDispensingService,
    PharmacyStockService,
    PharmacyChargeService,
  ],
  exports: [
    PharmacyDispensingService,
    PharmacyStockService,
  ],
})
export class PharmacyModule {}
