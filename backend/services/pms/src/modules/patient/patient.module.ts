import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [PatientController],
  providers: [PatientService, PatientRepository],
  exports: [PatientService, PatientRepository],
})
export class PatientModule {}

