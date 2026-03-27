import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { ReportStatusService } from './services/report-status.service';
import { LabReportsService } from './services/lab-reports.service';
import { ImagingReportsService } from './services/imaging-reports.service';
import { ProcedureReportsService } from './services/procedure-reports.service';
import { PatientResultsService } from './services/patient-results.service';

// Controllers
import { LabReportsController } from './controllers/lab-reports.controller';
import { ImagingReportsController } from './controllers/imaging-reports.controller';
import { ProcedureReportsController } from './controllers/procedure-reports.controller';
import { PatientResultsController } from './controllers/patient-results.controller';

@Module({
  controllers: [
    LabReportsController,
    ImagingReportsController,
    ProcedureReportsController,
    PatientResultsController,
  ],
  providers: [
    PrismaService,
    ReportStatusService,
    LabReportsService,
    ImagingReportsService,
    ProcedureReportsService,
    PatientResultsService,
  ],
  exports: [
    ReportStatusService,
    LabReportsService,
    ImagingReportsService,
    ProcedureReportsService,
    PatientResultsService,
  ],
})
export class ReportingModule {}
