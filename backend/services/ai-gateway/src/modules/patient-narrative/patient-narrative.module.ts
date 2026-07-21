import { Module } from '@nestjs/common';
import { PatientNarrativeController } from './controllers/patient-narrative.controller';
import { PatientNarrativeService } from './services/patient-narrative.service';
import { NarrativeCacheService } from './services/narrative-cache.service';

/**
 * Patient Narrative Module
 * AI Care Narrative for the Care Context workspace.
 *
 * Depends on the globally-provided Foundation/Clinical Prisma clients, the
 * shared LLMClientModule, and the globally-provided RedisModule (all wired in
 * AppModule).
 */
@Module({
  controllers: [PatientNarrativeController],
  providers: [PatientNarrativeService, NarrativeCacheService],
  exports: [PatientNarrativeService],
})
export class PatientNarrativeModule {}
