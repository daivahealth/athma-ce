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
import { EventService } from './event.service';

// Controllers
import { AdmissionController } from './admission.controller';
import { WardController } from './ward.controller';
import { DischargeController } from './discharge.controller';

@Module({
  imports: [ClinicalDatabaseModule, EncounterModule, BedSearchModule],
  controllers: [
    AdmissionController,
    WardController,
    DischargeController,
  ],
  providers: [
    AdmissionNumberGeneratorService,
    AdmissionService,
    BedBoardService,
    BedBrowserService,
    TransferService,
    DischargeService,
    EventService,
  ],
  exports: [
    AdmissionService,
    BedBoardService,
    BedBrowserService,
    TransferService,
    DischargeService,
    EventService,
  ],
})
export class InpatientModule {}
