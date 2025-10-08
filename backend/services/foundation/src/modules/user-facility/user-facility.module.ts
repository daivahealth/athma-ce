import { Module } from '@nestjs/common';
import { UserFacilityController, FacilityUsersController } from './user-facility.controller';
import { UserFacilityService } from './user-facility.service';
import { UserFacilityRepository } from './user-facility.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [UserFacilityController, FacilityUsersController],
  providers: [UserFacilityService, UserFacilityRepository],
  exports: [UserFacilityService, UserFacilityRepository],
})
export class UserFacilityModule {}

