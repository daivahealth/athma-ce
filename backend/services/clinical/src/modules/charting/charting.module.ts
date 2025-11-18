import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { EncounterNotesService } from './services/encounter-notes.service';
import { DiagnosisService } from './services/diagnosis.service';
import { ClinicalOrdersService } from './services/clinical-orders.service';
import { PrescriptionsService } from './services/prescriptions.service';

// Controllers
import { EncounterNotesController } from './controllers/encounter-notes.controller';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { ClinicalOrdersController } from './controllers/clinical-orders.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';

@Module({
  imports: [],
  controllers: [
    EncounterNotesController,
    DiagnosisController,
    ClinicalOrdersController,
    PrescriptionsController,
  ],
  providers: [
    PrismaService,
    EncounterNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
  exports: [
    EncounterNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
})
export class ChartingModule {}