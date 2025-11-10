import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { ClinicalNotesService } from './services/clinical-notes.service';
import { DiagnosisService } from './services/diagnosis.service';
import { ClinicalOrdersService } from './services/clinical-orders.service';
import { PrescriptionsService } from './services/prescriptions.service';

// Controllers
import { ClinicalNotesController } from './controllers/clinical-notes.controller';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { ClinicalOrdersController } from './controllers/clinical-orders.controller';
import { PrescriptionsController } from './controllers/prescriptions.controller';

@Module({
  imports: [],
  controllers: [
    ClinicalNotesController,
    DiagnosisController,
    ClinicalOrdersController,
    PrescriptionsController,
  ],
  providers: [
    PrismaService,
    ClinicalNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
  exports: [
    ClinicalNotesService,
    DiagnosisService,
    ClinicalOrdersService,
    PrescriptionsService,
  ],
})
export class ChartingModule {}