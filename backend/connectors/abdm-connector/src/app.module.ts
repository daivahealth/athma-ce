import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './modules/health/health.controller';
import { CorrelationService } from './modules/correlation/correlation.service';
import { CorrelationController } from './modules/correlation/correlation.controller';
import { CallbackService } from './modules/callback/callback.service';
import { AbdmCallbackVerifier } from './modules/callback/callback-verifier';
import { CallbackController, QuarantineController } from './modules/callback/callback.controller';
import { AbhaController } from './modules/abha/abha.controller';
import { AbhaService } from './modules/abha/abha.service';
import { AbdmSettingsService } from './modules/abha/abdm-settings.service';
import { AbdmCredentialsService } from './modules/abha/abdm-credentials.service';
import { AbdmSessionService } from './modules/abha/abdm-session.service';
import { AbdmCryptoService } from './modules/abha/abdm-crypto.service';
import { AbdmHttpGateway } from './modules/abha/abdm-http.gateway';
import { MockAbdmGateway } from './modules/abha/mock-abdm.gateway';
import { RegistriesController } from './modules/registries/registries.controller';
import { RegistriesService } from './modules/registries/registries.service';
import { EventsController } from './modules/events/events.controller';
import { InboxProcessorService } from './modules/events/inbox-processor.service';
import { CareContextService } from './modules/care-context/care-context.service';
import { CareContextController } from './modules/care-context/care-context.controller';
import { ConsentService } from './modules/consent/consent.service';
import { ConsentController } from './modules/consent/consent.controller';
import { JwksVerifierService } from './modules/callback/jwks-verifier.service';
import { DataFlowService } from './modules/data-flow/data-flow.service';
import { DataFlowController } from './modules/data-flow/data-flow.controller';
import { FideliusCryptoService } from './modules/data-flow/fidelius-crypto.service';
import { FhirBundleService } from './modules/data-flow/fhir-bundle.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env'] })],
  controllers: [
    HealthController,
    CorrelationController,
    CallbackController,
    QuarantineController,
    AbhaController,
    RegistriesController,
    EventsController,
    CareContextController,
    ConsentController,
    DataFlowController,
  ],
  providers: [
    PrismaService,
    CorrelationService,
    CallbackService,
    AbdmCallbackVerifier,
    AbhaService,
    AbdmSettingsService,
    AbdmCredentialsService,
    AbdmSessionService,
    AbdmCryptoService,
    AbdmHttpGateway,
    MockAbdmGateway,
    RegistriesService,
    CareContextService,
    InboxProcessorService,
    ConsentService,
    JwksVerifierService,
    DataFlowService,
    FideliusCryptoService,
    FhirBundleService,
  ],
})
export class AppModule {}
