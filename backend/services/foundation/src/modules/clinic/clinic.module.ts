import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController, ClinicStandaloneController } from './clinic.controller';
import { ClinicRepository } from './clinic.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [ClinicController, ClinicStandaloneController],
  providers: [ClinicService, ClinicRepository],
  exports: [ClinicService, ClinicRepository],
})
export class ClinicModule {}
