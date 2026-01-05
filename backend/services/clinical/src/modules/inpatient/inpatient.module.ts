/**
 * Inpatient Module
 *
 * Manages inpatient admissions, bed board, transfers, and discharge
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { EncounterModule } from '../encounter/encounter.module';

// Services
import { AdmissionNumberGeneratorService } from './admission-number-generator.service';
import { AdmissionService } from './admission.service';
import { BedBoardService } from './bed-board.service';
import { TransferService } from './transfer.service';
import { DischargeService } from './discharge.service';
import { EventService } from './event.service';

// Controllers
import { AdmissionController } from './admission.controller';
import { WardController } from './ward.controller';
import { DischargeController } from './discharge.controller';

@Module({
  imports: [ClinicalDatabaseModule, EncounterModule],
  controllers: [
    AdmissionController,
    WardController,
    DischargeController,
  ],
  providers: [
    AdmissionNumberGeneratorService,
    AdmissionService,
    BedBoardService,
    TransferService,
    DischargeService,
    EventService,
  ],
  exports: [
    AdmissionService,
    BedBoardService,
    TransferService,
    DischargeService,
    EventService,
  ],
})
export class InpatientModule {}
