import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';
import { SpecialtyModule } from '../specialty/specialty.module';

@Module({
  imports: [FoundationDatabaseModule, SpecialtyModule],
  controllers: [FacilityController],
  providers: [FacilityService, FacilityRepository],
  exports: [FacilityService, FacilityRepository],
})
export class FacilityModule {}
