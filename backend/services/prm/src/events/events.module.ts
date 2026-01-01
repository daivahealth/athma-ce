/**
 * Events Module
 */

import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { RulesModule } from '../rules/rules.module';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [RulesModule, JobsModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
