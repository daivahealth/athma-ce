import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsArray, IsISO8601, IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PrismaService } from '@zeal/database-clinical';
import { InternalApiKeyGuard } from '../../../common/guards/internal-api-key.guard';

// Seeded platform ids are UUID-shaped but not RFC-variant.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class AbdmConsentDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @Matches(UUID_SHAPE)
  consentId!: string;

  @IsString()
  @MaxLength(200)
  abhaAddress!: string;

  @IsIn(['GRANTED', 'REVOKED', 'EXPIRED'])
  status!: 'GRANTED' | 'REVOKED' | 'EXPIRED';

  @IsString()
  @MaxLength(500)
  purpose!: string;

  @IsArray()
  @IsString({ each: true })
  hiTypes!: string[];

  @IsOptional()
  @IsISO8601()
  fromDate?: string;

  @IsOptional()
  @IsISO8601()
  toDate?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;
}

/**
 * Internal service-to-service surface (X-Internal-Api-Key): lets the
 * abdm-connector resolve a patient's ABHA linkage and record consents when
 * reacting to gateway traffic — event payloads deliberately carry ids only
 * (ADR-0015 §5), so the connector fetches/writes what it needs here under an
 * explicit tenant scope.
 */
@Controller('internal/national-identity')
@UseGuards(InternalApiKeyGuard)
export class InternalIdentityController {
  constructor(private readonly prisma: PrismaService) {}

  /** The patient's verified ABHA linkage, or 404 when none. */
  @Get('patients/:patientId/abha')
  async getAbha(@Param('patientId') patientId: string, @Query('tenantId') tenantId: string) {
    if (!UUID_SHAPE.test(patientId) || !UUID_SHAPE.test(tenantId ?? '')) {
      throw new NotFoundException('Unknown patient');
    }
    const identity = await this.prisma.patientIdentity.findFirst({
      where: { tenantId, patientId, country: 'IN', identityType: 'abha' },
      orderBy: { createdAt: 'desc' },
    });
    if (!identity) throw new NotFoundException('Patient has no ABHA identity');
    return {
      patientId,
      abhaNumber: identity.value,
      abhaAddress: identity.secondaryValue,
      verificationStatus: identity.verificationStatus,
    };
  }

  /**
   * Records an ABDM consent artefact as a generic PatientConsent (ADR-0015:
   * state in core, protocol in the connector). Idempotent by the artefact's
   * consent id via linkedEntityType/linkedEntityId; revocation updates the
   * existing record.
   */
  @Post('abdm-consents')
  @HttpCode(HttpStatus.OK)
  async upsertAbdmConsent(@Body() dto: AbdmConsentDto) {
    const identity = await this.prisma.patientIdentity.findFirst({
      where: {
        tenantId: dto.tenantId,
        country: 'IN',
        identityType: 'abha',
        secondaryValue: dto.abhaAddress,
      },
    });
    if (!identity) {
      throw new BadRequestException(`No patient with ABHA address '${dto.abhaAddress}'`);
    }

    const revoked = dto.status === 'REVOKED';
    const base = {
      consentStatus: revoked ? 'revoked' : dto.status === 'EXPIRED' ? 'expired' : 'granted',
      isActive: dto.status === 'GRANTED',
      ...(revoked ? { revokedAt: new Date(), revocationMethod: 'abdm_hie_cm' } : {}),
      metadata: {
        abdmConsentId: dto.consentId,
        abhaAddress: dto.abhaAddress,
        hiTypes: dto.hiTypes,
        source: 'abdm-connector',
      } as never,
    };

    const existing = await this.prisma.patientConsent.findFirst({
      where: {
        tenantId: dto.tenantId,
        linkedEntityType: 'abdm_consent',
        linkedEntityId: dto.consentId,
      },
    });

    const consent = existing
      ? await this.prisma.patientConsent.update({ where: { id: existing.id }, data: base })
      : await this.prisma.patientConsent.create({
          data: {
            tenantId: dto.tenantId,
            patientId: identity.patientId,
            consentType: 'hie_data_sharing',
            consentCategory: 'abdm',
            consentScope: dto.hiTypes.join(','),
            purpose: dto.purpose,
            legalBasis: 'consent',
            effectiveFrom: dto.fromDate ? new Date(dto.fromDate) : new Date(),
            ...(dto.expiresAt ?? dto.toDate
              ? { effectiveUntil: new Date((dto.expiresAt ?? dto.toDate)!) }
              : {}),
            captureMethod: 'abdm_hie_cm',
            linkedEntityType: 'abdm_consent',
            linkedEntityId: dto.consentId,
            ...base,
          },
        });

    return { id: consent.id, patientId: consent.patientId, status: consent.consentStatus };
  }
}

