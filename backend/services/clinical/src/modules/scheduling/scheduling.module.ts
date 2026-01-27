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
import { CalendarService } from './calendar.service';

// Controllers
import { ScheduleController } from './schedule.controller';
import { AvailabilityController } from './availability.controller';
import { AppointmentController } from './appointment.controller';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [
    ScheduleController,
    AvailabilityController,
    AppointmentController,
    CalendarController,
  ],
  providers: [
    ScheduleService,
    AvailabilityService,
    AppointmentService,
    CalendarService,
  ],
  exports: [
    ScheduleService,
    AvailabilityService,
    AppointmentService,
    CalendarService,
  ],
})
export class SchedulingModule {}
