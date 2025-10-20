import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController, ClinicStandaloneController } from './clinic.controller';
import { ClinicRepository } from './clinic.repository';
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [ClinicController, ClinicStandaloneController],
  providers: [ClinicService, ClinicRepository],
  exports: [ClinicService, ClinicRepository],
})
export class ClinicModule {}
