import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

// Services
import { PayerService } from './services/payer.service';
import { PolicyService } from './services/policy.service';
import { EncounterCoverageService } from './services/encounter-coverage.service';
import { PayerContractService } from './services/payer-contract.service';

// Controllers
import { PayerController } from './controllers/payer.controller';
import { PolicyController } from './controllers/policy.controller';
import { EncounterCoverageController } from './controllers/encounter-coverage.controller';
import { PayerContractController } from './controllers/payer-contract.controller';

@Module({
  controllers: [
    PayerController,
    PolicyController,
    EncounterCoverageController,
    PayerContractController,
  ],
  providers: [
    PrismaService,
    PayerService,
    PolicyService,
    EncounterCoverageService,
    PayerContractService,
  ],
  exports: [
    PayerService,
    PolicyService,
    EncounterCoverageService,
    PayerContractService,
  ],
})
export class InsuranceModule {}
