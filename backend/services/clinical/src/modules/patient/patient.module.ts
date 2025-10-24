/**
 * Patient Module
 *
 * Manages patient records, documents, and history
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';

// Controllers
import { PatientController } from './patient.controller';
import { PatientDocumentController } from './patient-document.controller';
import { PatientHistoryController } from './patient-history.controller';

// Services
import { PatientService } from './patient.service';
import { PatientDocumentService } from './patient-document.service';
import { PatientHistoryService } from './patient-history.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [
    PatientController,
    PatientDocumentController,
    PatientHistoryController,
  ],
  providers: [
    PatientService,
    PatientDocumentService,
    PatientHistoryService,
  ],
  exports: [
    PatientService,
    PatientDocumentService,
    PatientHistoryService,
  ],
})
export class PatientModule {}
