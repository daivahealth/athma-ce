/**
 * Encounter Module
 *
 * Manages clinical encounters
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { EncounterController } from './encounter.controller';
import { EncounterService } from './encounter.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [EncounterController],
  providers: [EncounterService],
  exports: [EncounterService],
})
export class EncounterModule {}
