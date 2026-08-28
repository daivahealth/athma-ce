/**
 * National Identity Service
 *
 * Country-agnostic orchestration over the registered
 * {@link NationalIdentityProvider}s: which are offered to a tenant, offline
 * validation, the online challenge/verify round-trip, and persistence of the
 * resulting identity against a patient.
 *
 * PRIVACY: raw identifiers (Aadhaar), OTPs and provider tokens pass through
 * this service but are never written to the database or the log.
 */

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService, IdentityVerificationStatus } from '@zeal/database-clinical';
import { IdentityValidationRegistry } from '@zeal/validators';
import {
  IdentityProviderError,
  NATIONAL_IDENTITY_PROVIDERS,
  NationalIdentityProvider,
} from '../providers/national-identity-provider.interface';
import { AbdmConfigService } from '../providers/abha/abdm-config.service';
import { AbhaProvider } from '../providers/abha/abha.provider';
import { IdentityChallengeStore } from './identity-challenge.store';
import {
  CompleteChallengeDto,
  CreatePatientIdentityDto,
  StartChallengeDto,
  UpdatePatientIdentityDto,
  ValidateIdentityDto,
} from '../dto/national-identity.dto';

export interface RequestContext {
  tenantId: string;
  userId: string;
  facilityId?: string;
}

@Injectable()
export class NationalIdentityService {
  private readonly logger = new Logger(NationalIdentityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly challenges: IdentityChallengeStore,
    private readonly abdmConfig: AbdmConfigService,
    private readonly abhaProvider: AbhaProvider,
    @Inject(NATIONAL_IDENTITY_PROVIDERS)
    private readonly providers: NationalIdentityProvider[],
  ) {}

  // ------------------------------------------------------------- discovery

  /**
   * Providers available to this tenant. Drives the UI: the client renders
   * whatever comes back rather than hardcoding country logic.
   */
  async listProviders(tenantId: string, country?: string) {
    const enabledKeys = await this.abdmConfig.getEnabledProviderKeys(tenantId);
    const abdm = await this.abdmConfig.getSettings(tenantId);

    const result = [];

    for (const provider of this.providers) {
      const key = `${provider.country}:${provider.identityType}`.toUpperCase();

      // ABHA has its own master switch on top of the provider list, because
      // enabling it without credentials would surface a broken flow.
      if (provider.identityType === 'abha' && !abdm.enabled) continue;
      if (!enabledKeys.includes(key)) continue;
      if (country && provider.country.toUpperCase() !== country.toUpperCase()) continue;

      result.push({
        country: provider.country,
        identityType: provider.identityType,
        label: provider.label,
        capabilities: Array.from(provider.capabilities),
        loginHints: provider.loginHints,
        ...(provider.identityType === 'abha'
          ? {
              gateway: await this.abhaProvider.getGatewayName({ tenantId }),
              environment: abdm.environment,
            }
          : {}),
      });
    }

    return result;
  }

  // ------------------------------------------------------------- validation

  /** Offline validation. Works for any known document type, enabled or not. */
  validate(dto: ValidateIdentityDto) {
    const provider = this.findProvider(dto.country, dto.identityType);

    if (provider) {
      const result = provider.validate(dto.value);
      return { ...result, country: dto.country, identityType: dto.identityType };
    }

    // Fall back to the shared offline registry for types without a provider
    // (e.g. passport), so validation still runs.
    let result = IdentityValidationRegistry.validate(dto.country, dto.identityType, dto.value);

    // Some documents are international rather than national — the passport
    // validator is registered under 'INTL'. Retry there before giving up, so a
    // caller does not have to know which documents are country-scoped.
    if (!result.isValid && !IdentityValidationRegistry.hasValidator(dto.country, dto.identityType)) {
      result = IdentityValidationRegistry.validate('INTL', dto.identityType, dto.value);
    }

    return { ...result, country: dto.country, identityType: dto.identityType };
  }

  // -------------------------------------------------------------- challenge

  async startChallenge(dto: StartChallengeDto, context: RequestContext) {
    const provider = await this.requireEnabledProvider(
      context.tenantId,
      dto.country,
      dto.identityType,
    );

    const needed = dto.purpose === 'enroll' ? 'enroll' : 'verify';
    if (!provider.capabilities.has(needed) || !provider.startChallenge) {
      throw new BadRequestException(
        `${provider.label} does not support ${needed === 'enroll' ? 'enrolment' : 'online verification'}`,
      );
    }

    if (dto.patientId) {
      await this.requirePatient(dto.patientId, context.tenantId);
    }

    const challenge = await this.callProvider(() =>
      provider.startChallenge!({
        tenantId: context.tenantId,
        facilityId: context.facilityId,
        purpose: dto.purpose,
        loginHint: dto.loginHint,
        loginId: dto.loginId,
      }),
    );

    if (!challenge.txnId) {
      throw new ServiceUnavailableException('Identity provider did not return a transaction id');
    }

    await this.challenges.put(challenge.txnId, {
      tenantId: context.tenantId,
      ...(context.facilityId ? { facilityId: context.facilityId } : {}),
      country: provider.country,
      identityType: provider.identityType,
      purpose: dto.purpose,
      loginHint: dto.loginHint,
      ...(dto.patientId ? { patientId: dto.patientId } : {}),
    });

    // Logs the transaction, never the identifier.
    this.logger.log(
      `Started ${dto.purpose} challenge ${challenge.txnId} for ${provider.country}:${provider.identityType}`,
    );

    return {
      txnId: challenge.txnId,
      maskedTarget: challenge.maskedTarget,
      message: challenge.message,
      expiresAt: challenge.expiresAt,
      country: provider.country,
      identityType: provider.identityType,
      purpose: dto.purpose,
    };
  }

  async completeChallenge(txnId: string, dto: CompleteChallengeDto, context: RequestContext) {
    const stored = await this.challenges.get(txnId, context.tenantId);
    if (!stored) {
      throw new BadRequestException('Transaction not found or expired — request a new OTP');
    }

    const provider = this.findProvider(stored.country, stored.identityType);
    if (!provider?.completeChallenge) {
      throw new BadRequestException('Identity provider is no longer available');
    }

    const result = await this.callProvider(() =>
      provider.completeChallenge!({
        tenantId: context.tenantId,
        facilityId: stored.facilityId,
        txnId,
        purpose: stored.purpose,
        otp: dto.otp,
        ...(dto.mobile ? { mobile: dto.mobile } : {}),
      }),
    );

    // A verified transaction is single-use.
    await this.challenges.delete(txnId);

    const patientId = dto.patientId ?? stored.patientId;
    let identity = null;

    if (result.verified && result.identityValue && patientId) {
      await this.requirePatient(patientId, context.tenantId);
      identity = await this.upsertIdentity(
        patientId,
        {
          country: provider.country,
          identityType: provider.identityType,
          value: result.identityValue,
          ...(result.secondaryValue ? { secondaryValue: result.secondaryValue } : {}),
          verificationStatus: IdentityVerificationStatus.VERIFIED,
          ...(result.method ? { verificationMethod: result.method } : {}),
          isPrimary: true,
          ...(result.metadata ? { metadata: result.metadata } : {}),
        },
        context,
      );
    }

    this.logger.log(`Completed ${stored.purpose} challenge ${txnId} (verified=${result.verified})`);

    // `providerToken` is deliberately dropped here — it never reaches the
    // client and is never persisted.
    return {
      verified: result.verified,
      identityValue: result.identityValue,
      secondaryValue: result.secondaryValue,
      demographics: result.demographics,
      method: result.method,
      // Returned so a freshly enrolled account can claim an ABHA address.
      txnId,
      identity,
    };
  }

  // ------------------------------------------------------- patient identities

  /**
   * Records a newly claimed ABHA address on the patient's ABHA identity.
   * The address is the `secondaryValue` — it is what the HIE axis will later
   * use as `patientReference` (ADR-0012).
   */
  async attachAbhaAddress(patientId: string, abhaAddress: string, context: RequestContext) {
    await this.requirePatient(patientId, context.tenantId);

    const identity = await this.prisma.patientIdentity.findFirst({
      where: { tenantId: context.tenantId, patientId, country: 'IN', identityType: 'abha' },
      orderBy: { createdAt: 'desc' },
    });

    if (!identity) {
      throw new BadRequestException(
        'This patient has no ABHA number yet — verify or create one before claiming an address',
      );
    }

    return this.prisma.patientIdentity.update({
      where: { id: identity.id },
      data: { secondaryValue: abhaAddress },
    });
  }

  async listForPatient(patientId: string, tenantId: string) {
    await this.requirePatient(patientId, tenantId);
    return this.prisma.patientIdentity.findMany({
      where: { tenantId, patientId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createForPatient(
    patientId: string,
    dto: CreatePatientIdentityDto,
    context: RequestContext,
  ) {
    await this.requirePatient(patientId, context.tenantId);

    // Manually-entered identities are validated offline before being stored.
    const validation = this.validate({
      country: dto.country,
      identityType: dto.identityType,
      value: dto.value,
    });
    if (!validation.isValid) {
      throw new BadRequestException({
        message: `Invalid ${dto.identityType}`,
        errors: validation.errors,
      });
    }

    return this.upsertIdentity(
      patientId,
      { ...dto, value: validation.normalizedValue ?? dto.value },
      context,
    );
  }

  async updateForPatient(
    patientId: string,
    identityId: string,
    dto: UpdatePatientIdentityDto,
    context: RequestContext,
  ) {
    const existing = await this.prisma.patientIdentity.findFirst({
      where: { id: identityId, patientId, tenantId: context.tenantId },
    });
    if (!existing) throw new NotFoundException('Identity not found');

    if (dto.isPrimary) {
      await this.clearPrimary(patientId, context.tenantId, identityId);
    }

    const updated = await this.prisma.patientIdentity.update({
      where: { id: identityId },
      data: {
        ...(dto.isPrimary !== undefined ? { isPrimary: dto.isPrimary } : {}),
        ...(dto.secondaryValue !== undefined ? { secondaryValue: dto.secondaryValue } : {}),
        ...(dto.verificationStatus !== undefined
          ? { verificationStatus: dto.verificationStatus }
          : {}),
      },
    });

    if (updated.isPrimary) {
      await this.syncPatientPrimary(patientId, context.tenantId, updated);
    }

    return updated;
  }

  async removeForPatient(patientId: string, identityId: string, tenantId: string) {
    const existing = await this.prisma.patientIdentity.findFirst({
      where: { id: identityId, patientId, tenantId },
    });
    if (!existing) throw new NotFoundException('Identity not found');

    await this.prisma.patientIdentity.delete({ where: { id: identityId } });
    return { deleted: true };
  }

  // ---------------------------------------------------------------- internals

  /**
   * Inserts or updates the identity, keeping the denormalised
   * patients.national_id* columns in sync when it is the primary.
   */
  private async upsertIdentity(
    patientId: string,
    data: CreatePatientIdentityDto,
    context: RequestContext,
  ) {
    const { tenantId, userId } = context;
    const isPrimary = data.isPrimary ?? false;

    if (isPrimary) {
      await this.clearPrimary(patientId, tenantId);
    }

    const existing = await this.prisma.patientIdentity.findFirst({
      where: {
        tenantId,
        country: data.country.toUpperCase(),
        identityType: data.identityType,
        value: data.value,
      },
    });

    if (existing && existing.patientId !== patientId) {
      throw new BadRequestException(
        `This ${data.identityType} is already registered against another patient`,
      );
    }

    const verified = data.verificationStatus === IdentityVerificationStatus.VERIFIED;

    const payload = {
      tenantId,
      patientId,
      country: data.country.toUpperCase(),
      identityType: data.identityType,
      value: data.value,
      ...(data.secondaryValue ? { secondaryValue: data.secondaryValue } : {}),
      verificationStatus: data.verificationStatus ?? IdentityVerificationStatus.UNVERIFIED,
      ...(data.verificationMethod ? { verificationMethod: data.verificationMethod } : {}),
      ...(verified ? { verifiedAt: new Date(), verifiedBy: userId } : {}),
      isPrimary,
      ...(data.metadata ? { metadata: data.metadata as any } : {}),
      createdBy: userId,
    };

    const identity = existing
      ? await this.prisma.patientIdentity.update({
          where: { id: existing.id },
          data: {
            ...(data.secondaryValue ? { secondaryValue: data.secondaryValue } : {}),
            verificationStatus: payload.verificationStatus,
            ...(data.verificationMethod ? { verificationMethod: data.verificationMethod } : {}),
            ...(verified ? { verifiedAt: new Date(), verifiedBy: userId } : {}),
            isPrimary,
            ...(data.metadata ? { metadata: data.metadata as any } : {}),
          },
        })
      : await this.prisma.patientIdentity.create({ data: payload });

    if (isPrimary) {
      await this.syncPatientPrimary(patientId, tenantId, identity);
    }

    return identity;
  }

  private async clearPrimary(patientId: string, tenantId: string, exceptId?: string) {
    await this.prisma.patientIdentity.updateMany({
      where: {
        tenantId,
        patientId,
        isPrimary: true,
        ...(exceptId ? { id: { not: exceptId } } : {}),
      },
      data: { isPrimary: false },
    });
  }

  /**
   * Mirrors the primary identity onto patients.national_id/national_id_type/
   * issuing_country, which existing patient search and indexes rely on.
   */
  private async syncPatientPrimary(
    patientId: string,
    tenantId: string,
    identity: { value: string; identityType: string; country: string },
  ) {
    await this.prisma.patient.updateMany({
      where: { id: patientId, tenantId },
      data: {
        nationalId: identity.value,
        nationalIdType: identity.identityType,
        issuingCountry: identity.country,
      },
    });
  }

  private findProvider(country: string, identityType: string) {
    return this.providers.find(
      (p) =>
        p.country.toUpperCase() === country.toUpperCase() &&
        p.identityType.toLowerCase() === identityType.toLowerCase(),
    );
  }

  private async requireEnabledProvider(
    tenantId: string,
    country: string,
    identityType: string,
  ): Promise<NationalIdentityProvider> {
    const available = await this.listProviders(tenantId);
    const enabled = available.some(
      (p) =>
        p.country.toUpperCase() === country.toUpperCase() &&
        p.identityType.toLowerCase() === identityType.toLowerCase(),
    );

    if (!enabled) {
      throw new BadRequestException(
        `${country}:${identityType} is not enabled for this tenant. ` +
          'Enable it in Configurations (identity.enabled_providers, and abdm.enabled for ABHA).',
      );
    }

    const provider = this.findProvider(country, identityType);
    if (!provider) {
      throw new BadRequestException(`No provider registered for ${country}:${identityType}`);
    }
    return provider;
  }

  private async requirePatient(patientId: string, tenantId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, tenantId },
      select: { id: true },
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  /** Maps provider failures onto sensible HTTP semantics. */
  private async callProvider<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof IdentityProviderError) {
        if (error.retryable) {
          throw new ServiceUnavailableException({ code: error.code, message: error.message });
        }
        throw new BadRequestException({ code: error.code, message: error.message });
      }
      throw error;
    }
  }
}
