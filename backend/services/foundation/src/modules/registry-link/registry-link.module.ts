import { Module, OnModuleInit } from '@nestjs/common';
import { CapabilityRegistryService } from '@athma/plugin-sdk';
import { getDefaultValue, type ConfigValues } from '@zeal/config-client';
import { RegistryLinkController } from './registry-link.controller';
import { RegistryLinkService } from './registry-link.service';
import {
  HfrFacilityRegistryProvider,
  HprPractitionerRegistryProvider,
} from './providers/abdm-registry.providers';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule as AppConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [FoundationDatabaseModule, AuthModule, AppConfigModule],
  controllers: [RegistryLinkController],
  providers: [
    RegistryLinkService,
    HfrFacilityRegistryProvider,
    HprPractitionerRegistryProvider,
    {
      // Foundation resolves capability bindings against its own config tables
      // (it IS the config service), falling back to code defaults.
      provide: CapabilityRegistryService,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new CapabilityRegistryService({
          async get(key: string, context: { tenantId?: string; facilityId?: string }) {
            try {
              const resolved = await configService.resolve(key, context);
              return resolved.value;
            } catch {
              return getDefaultValue(key as keyof ConfigValues);
            }
          },
        }),
    },
  ],
  exports: [CapabilityRegistryService],
})
export class RegistryLinkModule implements OnModuleInit {
  constructor(
    private readonly capabilities: CapabilityRegistryService,
    private readonly hfr: HfrFacilityRegistryProvider,
    private readonly hpr: HprPractitionerRegistryProvider,
  ) {}

  onModuleInit(): void {
    this.capabilities.register(this.hfr);
    this.capabilities.register(this.hpr);
  }
}
