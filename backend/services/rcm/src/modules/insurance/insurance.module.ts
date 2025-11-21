import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { PayerService } from './services/payer.service';
import { PolicyService } from './services/policy.service';
import { EncounterCoverageService } from './services/encounter-coverage.service';

// Controllers
import { PayerController } from './controllers/payer.controller';
import { PolicyController } from './controllers/policy.controller';
import { EncounterCoverageController } from './controllers/encounter-coverage.controller';

@Module({
  controllers: [
    PayerController,
    PolicyController,
    EncounterCoverageController,
  ],
  providers: [
    PrismaService,
    PayerService,
    PolicyService,
    EncounterCoverageService,
  ],
  exports: [
    PayerService,
    PolicyService,
    EncounterCoverageService,
  ],
})
export class InsuranceModule {}
