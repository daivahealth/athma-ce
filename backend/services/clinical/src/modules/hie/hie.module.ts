/**
 * HIE Module
 *
 * Wires the consent-driven external-record fetch feature. The concrete HIE
 * network is bound to the {@link HIE_PROVIDER} token — swap MockHieProvider for
 * a real provider (ABDM, NABIDH, ...) here (or via config) without touching the
 * controller or service. See ADR-0012.
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { ConsentModule } from '../consent/consent.module';
import { PatientModule } from '../patient/patient.module';
import { HieController } from './hie.controller';
import { HieService } from './hie.service';
import { HIE_PROVIDER } from './providers/hie-provider.interface';
import { MockHieProvider } from './providers/mock-hie.provider';

@Module({
  imports: [ClinicalDatabaseModule, ConsentModule, PatientModule],
  controllers: [HieController],
  providers: [
    HieService,
    // Region-agnostic seam: the active HIE network is selected here.
    // Replace MockHieProvider with a config-driven factory when a real
    // network integration is available.
    { provide: HIE_PROVIDER, useClass: MockHieProvider },
  ],
  exports: [HieService],
})
export class HieModule {}
