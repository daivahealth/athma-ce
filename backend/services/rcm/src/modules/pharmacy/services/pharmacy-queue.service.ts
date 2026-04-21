import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';
import { firstValueFrom } from 'rxjs';
import { PharmacyQueueFiltersDto } from '../dto/pharmacy-queue.dto';

@Injectable()
export class PharmacyQueueService {
  private readonly logger = new Logger(PharmacyQueueService.name);
  private readonly clinicalServiceUrl = process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3011/api/v1';
  private readonly foundationServiceUrl = process.env.FOUNDATION_API_URL ?? 'http://localhost:3010/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Returns prescription headers that are active and not yet dispensed.
   * One queue card per Prescription (header), with all its drug lines.
   */
  async getQueue(
    tenantId: string,
    facilityId: string,
    userId: string,
    authHeader: string,
    filters: PharmacyQueueFiltersDto,
  ) {
    // Fetch active prescription headers from Clinical service
    const headers = await this.fetchActivePrescriptionHeaders(tenantId, facilityId, userId, authHeader, filters);

    if (!headers.length) return [];

    const prescriptionIds = headers.map((p: any) => p.id);

    // Find which prescription headers already have a dispensing record
    const existingDispensings = await this.prisma.pharmacyDispensing.findMany({
      where: {
        tenantId,
        prescriptionId: { in: prescriptionIds },
        status: { notIn: ['cancelled'] },
      },
      select: { prescriptionId: true, status: true, id: true, dispensingNumber: true },
    });

    const existingMap = new Map(existingDispensings.map((d) => [d.prescriptionId, d]));

    // Resolve staff display names for prescriptions missing prescribedByName (legacy rows)
    const missingNameUuids = [
      ...new Set(
        headers
          .filter((p: any) => !p.prescribedByName && p.prescribedBy)
          .map((p: any) => p.prescribedBy as string),
      ),
    ];
    const staffNameMap = await this.resolveStaffNames(tenantId, facilityId, userId, authHeader, missingNameUuids);

    // Build one queue card per prescription header
    const queue = headers.map((p: any) => {
      const existing = p.id ? existingMap.get(p.id) : undefined;
      const prescribedBy = p.prescribedByName ?? staffNameMap.get(p.prescribedBy) ?? null;
      return {
        // Prescription header identity
        prescriptionId: p.id,
        prescriptionNumber: p.prescriptionNumber,
        version: p.version,
        parentId: p.parentId ?? null,
        // Patient context
        patientId: p.patientId,
        encounterId: p.encounterId,
        mrn: p.mrn ?? null,
        patientDisplayName: p.patientDisplayName ?? null,
        dateOfBirth: p.dateOfBirth ?? null,
        gender: p.gender ?? null,
        encounterType: p.encounterType ?? 'outpatient',
        encounterNumber: p.encounterNumber ?? null,
        // Prescription authorship — always a human-readable name, never a raw UUID
        prescribedBy,
        prescribedAt: p.prescribedAt,
        notes: p.notes ?? null,
        prescriptionStatus: p.status,
        // Drug line items
        items: p.items ?? [],
        // Dispensing state
        dispensingId: existing?.id ?? null,
        dispensingNumber: existing?.dispensingNumber ?? null,
        dispensingStatus: existing?.status ?? 'pending',
      };
    });

    // Never show already-dispensed prescriptions in the active queue
    const active = queue.filter(
      (item: any) => !['dispensed', 'partially_dispensed'].includes(item.dispensingStatus ?? ''),
    );

    // Apply encounter type filter
    if (filters.encounterType) {
      return active.filter((item: any) => item.encounterType === filters.encounterType);
    }

    // Apply ward filter (inpatient)
    if (filters.wardId) {
      return active.filter((item: any) => item.wardId === filters.wardId);
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return active.filter(
        (item: any) =>
          item.patientDisplayName?.toLowerCase().includes(search) ||
          item.mrn?.toLowerCase().includes(search),
      );
    }

    return active;
  }

  /**
   * Get queue detail for a specific prescription (header + all items + dispensing record).
   */
  async getQueueItem(
    tenantId: string,
    prescriptionId: string,
    facilityId: string,
    userId: string,
    authHeader: string,
  ) {
    const prescription = await this.fetchPrescriptionHeader(tenantId, prescriptionId, facilityId, userId, authHeader);

    const existing = await this.prisma.pharmacyDispensing.findFirst({
      where: {
        tenantId,
        prescriptionId,
        status: { notIn: ['cancelled'] },
      },
      include: { items: true },
    });

    return {
      prescription,
      dispensing: existing ?? null,
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async fetchActivePrescriptionHeaders(
    tenantId: string,
    facilityId: string,
    userId: string,
    authHeader: string,
    filters: PharmacyQueueFiltersDto,
  ) {
    try {
      const params: Record<string, string> = { status: 'active', limit: '200' };
      if (filters.facilityId) params.facilityId = filters.facilityId;
      else if (facilityId) params.facilityId = facilityId;

      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescription-headers`, {
          headers: {
            'x-tenant-id': tenantId,
            'x-user-id': userId,
            'x-facility-id': facilityId,
            authorization: authHeader,
          },
          params,
        }),
      );

      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      this.logger.error(`Failed to fetch prescription headers from Clinical API: ${(error as Error).message}`);
      return [];
    }
  }

  /**
   * Fetch display names for a list of staff UUIDs from Foundation service.
   * Returns a Map<uuid, displayName>. Missing/failed lookups are silently skipped.
   */
  private async resolveStaffNames(
    tenantId: string,
    facilityId: string,
    userId: string,
    authHeader: string,
    staffIds: string[],
  ): Promise<Map<string, string>> {
    if (!staffIds.length) return new Map();

    const results = await Promise.allSettled(
      staffIds.map(async (id) => {
        const response = await firstValueFrom(
          this.httpService.get(`${this.foundationServiceUrl}/staff/${id}`, {
            headers: {
              'x-tenant-id': tenantId,
              'x-user-id': userId,
              'x-facility-id': facilityId,
              authorization: authHeader,
            },
          }),
        );
        return { id, displayName: response.data?.displayName as string };
      }),
    );

    const map = new Map<string, string>();
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.displayName) {
        map.set(result.value.id, result.value.displayName);
      }
    }
    return map;
  }

  private async fetchPrescriptionHeader(
    tenantId: string,
    prescriptionId: string,
    facilityId: string,
    userId: string,
    authHeader: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescription-headers/${prescriptionId}`, {
          headers: {
            'x-tenant-id': tenantId,
            'x-user-id': userId,
            'x-facility-id': facilityId,
            authorization: authHeader,
          },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch prescription header ${prescriptionId}: ${(error as Error).message}`);
      return null;
    }
  }
}
