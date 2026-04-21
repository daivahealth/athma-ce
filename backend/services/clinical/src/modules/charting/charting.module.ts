import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ObservationsModule } from '../observations/observations.module';

// Services
import { EncounterNotesService } from './services/encounter-notes.service';
import { DiagnosisService } from './services/diagnosis.service';
import { ClinicalOrdersService } from './services/clinical-orders.service';
import { PrescriptionsService } from './services/prescriptions.service';
import { PrescriptionHeadersService } from './services/prescription-headers.service';
import { ClinicalCodingsService } from './services/clinical-codings.service';

// Controllers
import { EncounterNotesController } from './controllers/encounter-notes.controller';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { ClinicalOrdersController } from './controllers/clinical-orders.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';
import { PrescriptionHeadersController } from './controllers/prescription-headers.controller';
import { ClinicalCodingsController } from './controllers/clinical-codings.controller';

@Module({
  imports: [ObservationsModule],
  controllers: [
    EncounterNotesController,
    DiagnosisController,
    ClinicalOrdersController,
    PrescriptionsController,
    PrescriptionHeadersController,
    ClinicalCodingsController,
  ],
  providers: [
    PrismaService,
    EncounterNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
    PrescriptionHeadersService,
    ClinicalCodingsService,
  ],
  exports: [
    EncounterNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
    PrescriptionHeadersService,
    ClinicalCodingsService,
  ],
})
export class ChartingModule {}