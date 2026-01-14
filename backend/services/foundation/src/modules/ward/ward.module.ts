import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController, WardStandaloneController, FacilityWardController } from './ward.controller';
import { WardRepository } from './ward.repository';
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule],
  controllers: [WardController, WardStandaloneController, FacilityWardController],
  providers: [WardService, WardRepository],
  exports: [WardService, WardRepository],
})
export class WardModule {}
