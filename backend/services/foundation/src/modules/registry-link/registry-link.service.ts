/**
 * National registry linking through the capability registry (issues
 * #108/#109). This service never names a country or vendor: it resolves the
 * tenant's registry.facility / registry.practitioner binding, delegates to
 * whichever provider is bound, and persists only the generic
 * externalRegistryId on the core record. An unbound capability is a normal
 * 409-style outcome, not an error path.
 */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import {
  CAPABILITY_KEYS,
  CapabilityRegistryService,
  type CapabilityContext,
  type FacilityRegistryProvider,
  type PractitionerRegistryProvider,
  type RegistrySearchQuery,
} from '@athma/plugin-sdk';

@Injectable()
export class RegistryLinkService {
  private readonly logger = new Logger(RegistryLinkService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly capabilities: CapabilityRegistryService,
  ) {}

  // ------------------------------------------------------------- facilities

  async searchFacilities(ctx: CapabilityContext, query: RegistrySearchQuery) {
    const provider = await this.requireFacilityProvider(ctx);
    return {
      provider: provider.providerId,
      records: await provider.search(ctx, query),
    };
  }

  async linkFacility(ctx: CapabilityContext, facilityId: string, registryId: string) {
    const facility = await this.prisma.facility.findFirst({
      where: { id: facilityId, tenantId: ctx.tenantId },
    });
    if (!facility) throw new NotFoundException(`Facility '${facilityId}' not found`);

    const provider = await this.requireFacilityProvider(ctx);
    const result = await provider.link(ctx, facilityId, registryId);

    await this.prisma.facility.update({
      where: { id: facilityId },
      data: { externalRegistryId: result.registryId },
    });
    this.logger.log(
      `Facility ${facilityId} linked to ${provider.providerId}:${result.registryId} (tenant ${ctx.tenantId})`,
    );
    return { provider: provider.providerId, ...result };
  }

  async facilityStatus(ctx: CapabilityContext, facilityId: string) {
    const facility = await this.prisma.facility.findFirst({
      where: { id: facilityId, tenantId: ctx.tenantId },
      select: { id: true, name: true, externalRegistryId: true },
    });
    if (!facility) throw new NotFoundException(`Facility '${facilityId}' not found`);

    const resolution = await this.capabilities.resolve<FacilityRegistryProvider>(
      CAPABILITY_KEYS.REGISTRY_FACILITY,
      ctx,
    );
    return {
      facilityId: facility.id,
      linked: Boolean(facility.externalRegistryId),
      registryId: facility.externalRegistryId,
      capabilityBound: resolution.bound,
      provider: resolution.bound ? resolution.provider.providerId : null,
    };
  }

  // ---------------------------------------------------------- practitioners

  async searchPractitioners(ctx: CapabilityContext, query: RegistrySearchQuery) {
    const provider = await this.requirePractitionerProvider(ctx);
    return {
      provider: provider.providerId,
      records: await provider.search(ctx, query),
    };
  }

  async linkPractitioner(ctx: CapabilityContext, staffId: string, registryId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, tenantId: ctx.tenantId },
    });
    if (!staff) throw new NotFoundException(`Staff '${staffId}' not found`);

    const provider = await this.requirePractitionerProvider(ctx);
    const result = await provider.link(ctx, staffId, registryId);

    await this.prisma.staff.update({
      where: { id: staffId },
      data: { externalRegistryId: result.registryId },
    });
    this.logger.log(
      `Staff ${staffId} linked to ${provider.providerId}:${result.registryId} (tenant ${ctx.tenantId})`,
    );
    return { provider: provider.providerId, ...result };
  }

  async practitionerStatus(ctx: CapabilityContext, staffId: string) {
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, tenantId: ctx.tenantId },
      select: { id: true, externalRegistryId: true },
    });
    if (!staff) throw new NotFoundException(`Staff '${staffId}' not found`);

    const resolution = await this.capabilities.resolve<PractitionerRegistryProvider>(
      CAPABILITY_KEYS.REGISTRY_PRACTITIONER,
      ctx,
    );
    return {
      staffId: staff.id,
      linked: Boolean(staff.externalRegistryId),
      registryId: staff.externalRegistryId,
      capabilityBound: resolution.bound,
      provider: resolution.bound ? resolution.provider.providerId : null,
    };
  }

  // ---------------------------------------------------------------- helpers

  private async requireFacilityProvider(ctx: CapabilityContext): Promise<FacilityRegistryProvider> {
    const resolution = await this.capabilities.resolve<FacilityRegistryProvider>(
      CAPABILITY_KEYS.REGISTRY_FACILITY,
      ctx,
    );
    if (!resolution.bound) {
      throw this.unboundError('facility', resolution.reason);
    }
    return resolution.provider;
  }

  private async requirePractitionerProvider(
    ctx: CapabilityContext,
  ): Promise<PractitionerRegistryProvider> {
    const resolution = await this.capabilities.resolve<PractitionerRegistryProvider>(
      CAPABILITY_KEYS.REGISTRY_PRACTITIONER,
      ctx,
    );
    if (!resolution.bound) {
      throw this.unboundError('practitioner', resolution.reason);
    }
    return resolution.provider;
  }

  private unboundError(kind: string, reason: string) {
    if (reason === 'provider_not_registered') {
      return new BadRequestException(
        `The ${kind} registry provider bound for this tenant is not available on this deployment`,
      );
    }
    return new ConflictException(
      `No ${kind} registry is configured for this tenant — apply a country pack or set the capability binding`,
    );
  }
}
