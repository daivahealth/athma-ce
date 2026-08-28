import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';

// Seeded platform ids are UUID-shaped but not RFC-variant.
const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Internal surface for the abdm-connector's consented data provision
 * (issue #116): the minimal encounter + patient summary an OPConsultRecord
 * FHIR bundle is built from. Explicit tenant scoping; PHI leaves core only
 * per-use, against a consent artefact the connector validates first.
 */
@Controller('internal/encounters')
@UseGuards(InternalApiKeyGuard)
export class InternalEncounterController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':encounterId/summary')
  async getSummary(
    @Param('encounterId') encounterId: string,
    @Query('tenantId') tenantId: string,
  ) {
    if (!UUID_SHAPE.test(encounterId) || !UUID_SHAPE.test(tenantId ?? '')) {
      throw new NotFoundException('Unknown encounter');
    }
    const encounter = await this.prisma.encounter.findFirst({
      where: { id: encounterId, tenantId },
      include: {
        patient: {
          select: {
            id: true,
            mrn: true,
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
    });
    if (!encounter) throw new NotFoundException('Unknown encounter');

    return {
      encounter: {
        id: encounter.id,
        encounterNumber: encounter.encounterNumber,
        encounterClass: encounter.encounterClass,
        encounterType: encounter.encounterType,
        status: encounter.status,
        startTime: encounter.startTime?.toISOString(),
        endTime: encounter.endTime?.toISOString() ?? null,
        chiefComplaint: encounter.chiefComplaint,
        facilityName: encounter.facilityName,
        departmentName: encounter.departmentName,
      },
      patient: {
        id: encounter.patient.id,
        mrn: encounter.patient.mrn,
        firstName: encounter.patient.firstName,
        lastName: encounter.patient.lastName,
        gender: encounter.patient.gender,
        dateOfBirth: encounter.patient.dateOfBirth?.toISOString() ?? null,
      },
    };
  }
}
