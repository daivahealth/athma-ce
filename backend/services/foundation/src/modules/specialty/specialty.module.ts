import { Module } from '@nestjs/common';
import { DatabaseModule } from '@zeal/shared-database';
import { SpecialtyController, StaffSpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { SpecialtyRepository } from './specialty.repository';
import { StaffSpecialtyRepository } from './staff-specialty.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [SpecialtyController, StaffSpecialtyController],
  providers: [SpecialtyService, SpecialtyRepository, StaffSpecialtyRepository],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
