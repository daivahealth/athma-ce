import { Module } from '@nestjs/common';
import { DatabaseModule } from '@zeal/shared-database';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { FacilityRepository } from './facility.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [FacilityController],
  providers: [FacilityService, FacilityRepository],
  exports: [FacilityService, FacilityRepository],
})
export class FacilityModule {}
