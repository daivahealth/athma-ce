import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
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

// Jobs
import { PharmacyQueueSyncJob } from './jobs/pharmacy-queue-sync.job';

// Dependencies from Billing module
import { BillingModule } from '../billing/billing.module';
// Catalog mapping for medication → billing item resolution
import { CatalogMappingModule } from '../catalog-mappings/catalog-mapping.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BillingModule,
    CatalogMappingModule,
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
    PharmacyQueueSyncJob,
  ],
  exports: [
    PharmacyDispensingService,
    PharmacyStockService,
  ],
})
export class PharmacyModule {}
