import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { WellnessAssessmentService } from './services/wellness-assessment.service';
import { WellnessScoreService } from './services/wellness-score.service';
import { WellnessProgramService } from './services/wellness-program.service';
import { BiomarkerService } from './services/biomarker.service';
import { LongevityService } from './services/longevity.service';
import { LifestyleService } from './services/lifestyle.service';

// Controllers
import { WellnessAssessmentController } from './controllers/wellness-assessment.controller';
import { WellnessProgramController } from './controllers/wellness-program.controller';
import { BiomarkerController } from './controllers/biomarker.controller';
import { LongevityController } from './controllers/longevity.controller';
import { LifestyleController } from './controllers/lifestyle.controller';

@Module({
  imports: [],
  controllers: [
    WellnessAssessmentController,
    WellnessProgramController,
    BiomarkerController,
    LongevityController,
    LifestyleController,
  ],
  providers: [
    PrismaService,
    WellnessAssessmentService,
    WellnessScoreService,
    WellnessProgramService,
    BiomarkerService,
    LongevityService,
    LifestyleService,
  ],
  exports: [
    WellnessAssessmentService,
    WellnessScoreService,
    WellnessProgramService,
    BiomarkerService,
    LongevityService,
    LifestyleService,
  ],
})
export class WellnessModule { }
