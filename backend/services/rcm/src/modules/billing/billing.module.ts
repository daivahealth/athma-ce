import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { BillingItemService } from './services/billing-item.service';
import { ChargeService } from './services/charge.service';
import { InvoiceService } from './services/invoice.service';
import { ReceiptService } from './services/receipt.service';
import { ChargePostingService } from './services/charge-posting.service';

// Controllers
import { BillingItemController } from './controllers/billing-item.controller';
import { ChargeController } from './controllers/charge.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { ReceiptController } from './controllers/receipt.controller';
import { ChargePostingRuleController } from './controllers/charge-posting-rule.controller';

@Module({
  controllers: [
    BillingItemController,
    ChargeController,
    InvoiceController,
    ReceiptController,
    ChargePostingRuleController,
  ],
  providers: [
    PrismaService,
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    ChargePostingService,
  ],
  exports: [
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    ChargePostingService,
  ],
})
export class BillingModule {}
