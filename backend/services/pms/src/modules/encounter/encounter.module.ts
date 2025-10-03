import { Module } from '@nestjs/common';
import { EncounterController } from './encounter.controller';
import { EncounterService } from './encounter.service';
import { EncounterRepository } from './encounter.repository';
import { DatabaseModule } from '@zeal/shared-database';

@Module({
  imports: [DatabaseModule],
  controllers: [EncounterController],
  providers: [EncounterService, EncounterRepository],
  exports: [EncounterService, EncounterRepository],
})
export class EncounterModule {}

