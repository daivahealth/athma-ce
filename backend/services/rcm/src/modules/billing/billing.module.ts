import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { BillingItemService } from './services/billing-item.service';
import { ChargeService } from './services/charge.service';
import { InvoiceService } from './services/invoice.service';
import { ReceiptService } from './services/receipt.service';
import { RefundService } from './services/refund.service';
import { ChargePostingService } from './services/charge-posting.service';
import { FeeScheduleService } from './services/fee-schedule.service';

// Controllers
import { BillingItemController } from './controllers/billing-item.controller';
import { ChargeController } from './controllers/charge.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { ReceiptController } from './controllers/receipt.controller';
import { RefundController } from './controllers/refund.controller';
import { ChargePostingRuleController } from './controllers/charge-posting-rule.controller';
import { FeeScheduleController } from './controllers/fee-schedule.controller';

// Medical Coding Integration
import { MedicalCodingModule } from '../medical-coding/medical-coding.module';

@Module({
  imports: [
    MedicalCodingModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    BillingItemController,
    ChargeController,
    InvoiceController,
    ReceiptController,
    RefundController,
    ChargePostingRuleController,
    FeeScheduleController,
  ],
  providers: [
    PrismaService,
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    RefundService,
    ChargePostingService,
    FeeScheduleService,
  ],
  exports: [
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    RefundService,
    ChargePostingService,
    FeeScheduleService,
  ],
})
export class BillingModule {}
