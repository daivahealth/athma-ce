import { Module } from '@nestjs/common';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { SpecialtyController, StaffSpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { SpecialtyRepository } from './specialty.repository';
import { StaffSpecialtyRepository } from './staff-specialty.repository';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [SpecialtyController, StaffSpecialtyController],
  providers: [SpecialtyService, SpecialtyRepository, StaffSpecialtyRepository],
  exports: [SpecialtyService],
})
export class SpecialtyModule {}
