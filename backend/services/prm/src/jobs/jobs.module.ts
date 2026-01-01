/**
 * Jobs Module
 */

import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsRunnerService } from './jobs-runner.service';
import { JobsExecutorService } from './jobs-executor.service';
import { ConsentModule } from '../clients/consent/consent.module';

@Module({
  imports: [ConsentModule],
  providers: [JobsService, JobsRunnerService, JobsExecutorService],
  exports: [JobsService],
})
export class JobsModule {}
