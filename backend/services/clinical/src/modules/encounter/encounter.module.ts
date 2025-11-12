/**
 * Encounter Module
 *
 * Manages clinical encounters
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { EncounterController } from './encounter.controller';
import { EncounterService } from './encounter.service';
import { EncounterNumberGeneratorService } from './encounter-number-generator.service';
import { TriageController } from './triage.controller';
import { TriageService } from './triage.service';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [EncounterController, TriageController],
  providers: [EncounterService, EncounterNumberGeneratorService, TriageService],
  exports: [EncounterService, EncounterNumberGeneratorService, TriageService],
})
export class EncounterModule {}
