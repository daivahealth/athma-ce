/**
 * Scheduling Module
 *
 * Multi-resource appointment scheduling system
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';

// Services
import { ScheduleService } from './schedule.service';
import { AvailabilityService } from './availability.service';
import { AppointmentService } from './appointment.service';

@Module({
  imports: [ClinicalDatabaseModule],
  providers: [
    ScheduleService,
    AvailabilityService,
    AppointmentService,
  ],
  exports: [
    ScheduleService,
    AvailabilityService,
    AppointmentService,
  ],
})
export class SchedulingModule {}
