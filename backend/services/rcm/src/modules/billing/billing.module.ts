import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { BillingItemService } from './services/billing-item.service';
import { ChargeService } from './services/charge.service';
import { InvoiceService } from './services/invoice.service';
import { ReceiptService } from './services/receipt.service';
import { RefundService } from './services/refund.service';
import { CreditNoteService } from './services/credit-note.service';
import { DebitNoteService } from './services/debit-note.service';
import { ChargePostingService } from './services/charge-posting.service';
import { FeeScheduleService } from './services/fee-schedule.service';
import { PatientLedgerService } from './services/patient-ledger.service';

// Controllers
import { BillingItemController } from './controllers/billing-item.controller';
import { ChargeController } from './controllers/charge.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { ReceiptController } from './controllers/receipt.controller';
import { RefundController } from './controllers/refund.controller';
import { CreditNoteController } from './controllers/credit-note.controller';
import { DebitNoteController } from './controllers/debit-note.controller';
import { ChargePostingRuleController } from './controllers/charge-posting-rule.controller';
import { FeeScheduleController } from './controllers/fee-schedule.controller';
import { PatientLedgerController } from './controllers/patient-ledger.controller';

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
    CreditNoteController,
    DebitNoteController,
    ChargePostingRuleController,
    FeeScheduleController,
    PatientLedgerController,
  ],
  providers: [
    PrismaService,
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    RefundService,
    CreditNoteService,
    DebitNoteService,
    ChargePostingService,
    FeeScheduleService,
    PatientLedgerService,
  ],
  exports: [
    BillingItemService,
    ChargeService,
    InvoiceService,
    ReceiptService,
    RefundService,
    CreditNoteService,
    DebitNoteService,
    ChargePostingService,
    FeeScheduleService,
    PatientLedgerService,
  ],
})
export class BillingModule {}
