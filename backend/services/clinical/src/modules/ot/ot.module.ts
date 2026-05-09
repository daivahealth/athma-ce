import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { OtRequestsController } from './controllers/ot-requests.controller';
import { OtSchedulesController } from './controllers/ot-schedules.controller';
import { OtRoomsController } from './controllers/ot-rooms.controller';
import { OtReportsController } from './controllers/ot-reports.controller';
import { OtFoundationService } from './services/ot-foundation.service';
import { OtRoomsService } from './services/ot-rooms.service';
import { OtRequestsService } from './services/ot-requests.service';
import { OtSchedulesService } from './services/ot-schedules.service';
import { OtReportsService } from './services/ot-reports.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [
    OtRequestsController,
    OtSchedulesController,
    OtRoomsController,
    OtReportsController,
  ],
  providers: [
    OtFoundationService,
    OtRoomsService,
    OtRequestsService,
    OtSchedulesService,
    OtReportsService,
  ],
  exports: [
    OtRoomsService,
    OtRequestsService,
    OtSchedulesService,
    OtReportsService,
  ],
})
export class OtModule {}
