import { Module } from '@nestjs/common';
import { BedService } from './bed.service';
import { BedController, BedStandaloneController } from './bed.controller';
import { BedRepository } from './bed.repository';
import { WardModule } from '../ward/ward.module';
import { FoundationDatabaseModule } from '@zeal/database-foundation';

@Module({
  imports: [FoundationDatabaseModule, WardModule],
  controllers: [BedController, BedStandaloneController],
  providers: [BedService, BedRepository],
  exports: [BedService, BedRepository],
})
export class BedModule {}
