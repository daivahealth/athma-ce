import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { InternalApiKeyGuard } from '../../../common/guards/internal-api-key.guard';

// Seeded platform ids are UUID-shaped but not RFC-variant.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Internal service-to-service surface (X-Internal-Api-Key): lets the
 * abdm-connector resolve a patient's ABHA linkage when reacting to domain
 * events — event payloads deliberately carry ids only (ADR-0015 §5), so the
 * connector fetches what it needs here, under an explicit tenant scope,
 * audited by the shared internal-key convention.
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
}
