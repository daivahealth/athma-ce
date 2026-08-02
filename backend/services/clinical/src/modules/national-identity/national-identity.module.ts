/**
 * National Identity Module
 *
 * Country-agnostic national ID verification. Providers are registered under a
 * DI multi-token so adding a country means adding a provider class and one
 * array entry — nothing else in the module or the UI changes.
 *
 * See ADR "National Identity Provider abstraction" for why ABHA is modelled as
 * an identity provider and NOT as an `HieProvider` (that is the separate
 * data-exchange axis, ADR-0012).
 */

import { Module } from '@nestjs/common';
import { ClinicalDatabaseModule } from '@zeal/database-clinical';
import { NationalIdentityService } from './services/national-identity.service';
import { IdentityChallengeStore } from './services/identity-challenge.store';
import {
  NationalIdentityController,
  PatientIdentityController,
} from './controllers/national-identity.controller';
import { AbhaController } from './controllers/abha.controller';
import { NATIONAL_IDENTITY_PROVIDERS } from './providers/national-identity-provider.interface';
import { EmiratesIdProvider } from './providers/emirates-id/emirates-id.provider';
import { AbhaProvider } from './providers/abha/abha.provider';
import { AbdmConfigService } from './providers/abha/abdm-config.service';
import { AbdmSessionService } from './providers/abha/abdm-session.service';
import { AbdmCryptoService } from './providers/abha/abdm-crypto.service';
import { AbdmHttpGateway } from './providers/abha/abdm-http.gateway';
import { MockAbdmGateway } from './providers/abha/mock-abdm.gateway';
import { ABDM_GATEWAY } from './providers/abha/abdm-gateway.interface';

@Module({
  imports: [ClinicalDatabaseModule],
  controllers: [NationalIdentityController, PatientIdentityController, AbhaController],
  providers: [
    NationalIdentityService,
    IdentityChallengeStore,
    AbdmConfigService,
    AbdmSessionService,
    AbdmCryptoService,
    AbdmHttpGateway,
    MockAbdmGateway,
    EmiratesIdProvider,
    AbhaProvider,

    /**
     * Real gateway when NHA credentials are deployed, offline mock otherwise —
     * mirroring the MockHieProvider precedent. Bound once at boot: changing
     * credentials requires a restart.
     */
    {
      provide: ABDM_GATEWAY,
      inject: [AbdmConfigService, AbdmHttpGateway, MockAbdmGateway],
      useFactory: (
        config: AbdmConfigService,
        live: AbdmHttpGateway,
        mock: MockAbdmGateway,
      ) => (config.hasCredentials ? live : mock),
    },

    /** The registry the service iterates. Add new countries here. */
    {
      provide: NATIONAL_IDENTITY_PROVIDERS,
      inject: [EmiratesIdProvider, AbhaProvider],
      useFactory: (emiratesId: EmiratesIdProvider, abha: AbhaProvider) => [emiratesId, abha],
    },
  ],
  exports: [NationalIdentityService],
})
export class NationalIdentityModule {}
