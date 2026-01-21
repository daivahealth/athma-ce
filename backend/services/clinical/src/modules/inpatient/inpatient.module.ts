/**
 * Inpatient Module
 *
 * Manages inpatient admissions, bed board, transfers, and discharge
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { EncounterModule } from '../encounter/encounter.module';
import { BedSearchModule } from '../bed-search/bed-search.module';

// Services
import { AdmissionNumberGeneratorService } from './admission-number-generator.service';
import { AdmissionService } from './admission.service';
import { BedBoardService } from './bed-board.service';
import { BedBrowserService } from './bed-browser.service';
import { TransferService } from './transfer.service';
import { DischargeService } from './discharge.service';
import { DischargeTransactionService } from './discharge-transaction.service';
import { DischargeSummaryService } from './discharge-summary.service';
import { EventService } from './event.service';
import { ChannelService } from './channel.service';
import { MembershipService } from './membership.service';
import { MessageService } from './message.service';
import { ChannelEventEmitter } from './channel-event-emitter.service';
import { ChecklistTemplateService } from './checklist-template.service';
import { ChecklistInstanceService } from './checklist-instance.service';
import { ChecklistResponseService } from './checklist-response.service';
import { ChecklistIntegrationService } from './checklist-integration.service';

// Controllers
import { AdmissionController } from './admission.controller';
import { WardController } from './ward.controller';
import { DischargeController } from './discharge.controller';
import { DischargeTransactionController } from './discharge-transaction.controller';
import { DischargeSummaryController } from './discharge-summary.controller';
import { ChannelController } from './channel.controller';
import { MembershipController } from './membership.controller';
import { MessageController } from './message.controller';
import { ChecklistTemplateController } from './checklist-template.controller';
import { ChecklistController } from './checklist.controller';

@Module({
  imports: [ClinicalDatabaseModule, EncounterModule, BedSearchModule],
  controllers: [
    AdmissionController,
    WardController,
    DischargeController,
    DischargeTransactionController,
    DischargeSummaryController,
    ChannelController,
    MembershipController,
    MessageController,
    ChecklistTemplateController,
    ChecklistController,
  ],
  providers: [
    AdmissionNumberGeneratorService,
    AdmissionService,
    BedBoardService,
    BedBrowserService,
    TransferService,
    DischargeService,
    DischargeTransactionService,
    DischargeSummaryService,
    EventService,
    ChannelService,
    MembershipService,
    MessageService,
    ChannelEventEmitter,
    ChecklistTemplateService,
    ChecklistInstanceService,
    ChecklistResponseService,
    ChecklistIntegrationService,
  ],
  exports: [
    AdmissionService,
    BedBoardService,
    BedBrowserService,
    TransferService,
    DischargeService,
    DischargeTransactionService,
    DischargeSummaryService,
    EventService,
    ChannelService,
    MembershipService,
    MessageService,
    ChannelEventEmitter,
    ChecklistTemplateService,
    ChecklistInstanceService,
    ChecklistResponseService,
    ChecklistIntegrationService,
  ],
})
export class InpatientModule {}
