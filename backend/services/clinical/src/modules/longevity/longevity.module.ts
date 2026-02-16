import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

// Services
import { LongevityProtocolService } from './services/longevity-protocol.service';
import { ScreeningProtocolService } from './services/screening-protocol.service';
import { BiologicalAgeCalculatorService } from './services/biological-age-calculator.service';

// Controllers
import { LongevityTreatmentController } from './controllers/longevity-treatment.controller';
import { ScreeningProtocolController } from './controllers/screening-protocol.controller';

@Module({
  imports: [],
  controllers: [
    LongevityTreatmentController,
    ScreeningProtocolController,
  ],
  providers: [
    PrismaService,
    LongevityProtocolService,
    ScreeningProtocolService,
    BiologicalAgeCalculatorService,
  ],
  exports: [
    LongevityProtocolService,
    ScreeningProtocolService,
    BiologicalAgeCalculatorService,
  ],
})
export class LongevityModule {}
