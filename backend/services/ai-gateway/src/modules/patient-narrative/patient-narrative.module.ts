import { Module } from '@nestjs/common';
import { PatientNarrativeController } from './controllers/patient-narrative.controller';
import { PatientNarrativeService } from './services/patient-narrative.service';

/**
 * Patient Narrative Module
 * AI Care Narrative for the Care Context workspace.
 *
 * Depends on the globally-provided Foundation/Clinical Prisma clients and the
 * shared LLMClientModule (both wired in AppModule).
 */
@Module({
  controllers: [PatientNarrativeController],
  providers: [PatientNarrativeService],
  exports: [PatientNarrativeService],
})
export class PatientNarrativeModule {}
