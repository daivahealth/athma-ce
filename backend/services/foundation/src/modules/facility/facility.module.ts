import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@zeal/shared-database';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';
import { SpecialtyModule } from '../specialty/specialty.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => SpecialtyModule)],
  controllers: [FacilityController],
  providers: [FacilityService, FacilityRepository],
  exports: [FacilityService, FacilityRepository],
})
export class FacilityModule {}
