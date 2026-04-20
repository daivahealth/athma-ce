import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';
import { firstValueFrom } from 'rxjs';
import { PharmacyQueueFiltersDto } from '../dto/pharmacy-queue.dto';

@Injectable()
export class PharmacyQueueService {
  private readonly logger = new Logger(PharmacyQueueService.name);
  private readonly clinicalServiceUrl = process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3011/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Returns active prescriptions not yet queued/dispensed.
   * Fetches from Clinical API then filters out already-processed prescriptions.
   */
  async getQueue(tenantId: string, facilityId: string, userId: string, authHeader: string, filters: PharmacyQueueFiltersDto) {
    // Fetch active prescriptions from Clinical service
    const prescriptions = await this.fetchActivePrescriptions(tenantId, facilityId, userId, authHeader, filters);

    if (!prescriptions.length) return [];

    const rxIds = prescriptions.map((rx: any) => rx.id);

    // Find which ones are already in a non-cancelled dispensing record
    const existingDispensings = await this.prisma.pharmacyDispensing.findMany({
      where: {
        tenantId,
        prescriptionOrderId: { in: rxIds },
        status: { notIn: ['cancelled'] },
      },
      select: { prescriptionOrderId: true, status: true, id: true, dispensingNumber: true },
    });

    const existingMap = new Map(existingDispensings.map((d) => [d.prescriptionOrderId, d]));

    // Enrich prescriptions with dispensing status
    const queue = prescriptions.map((rx: any) => {
      const existing = existingMap.get(rx.id);
      return {
        prescriptionOrderId: rx.id,
        patientId: rx.patientId,
        encounterId: rx.encounterId,
        mrn: rx.mrn ?? null,
        patientDisplayName: rx.patientDisplayName ?? null,
        encounterType: rx.encounterType ?? 'outpatient',
        encounterNumber: rx.encounterNumber ?? null,
        drugCode: rx.drugCode,
        drugName: rx.drugName,
        dosage: rx.dosage,
        route: rx.route,
        frequency: rx.frequency,
        duration: rx.duration,
        quantity: rx.quantity,
        instructions: rx.instructions,
        prescribedBy: rx.prescribedBy ?? null,
        prescribedAt: rx.prescribedAt,
        prescriptionStatus: rx.status,
        dispensingId: existing?.id ?? null,
        dispensingNumber: existing?.dispensingNumber ?? null,
        dispensingStatus: existing?.status ?? 'pending',
        // Ward info for inpatient (if available from Clinical API)
        wardId: rx.wardId ?? null,
        wardName: rx.wardName ?? null,
        bedNumber: rx.bedNumber ?? null,
      };
    });

    // Apply encounter type filter
    if (filters.encounterType) {
      return queue.filter((item: any) => item.encounterType === filters.encounterType);
    }

    // Apply ward filter (inpatient)
    if (filters.wardId) {
      return queue.filter((item: any) => item.wardId === filters.wardId);
    }

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return queue.filter(
        (item: any) =>
          item.patientDisplayName?.toLowerCase().includes(search) ||
          item.mrn?.toLowerCase().includes(search),
      );
    }

    return queue;
  }

  async getQueueItem(tenantId: string, prescriptionOrderId: string, facilityId: string, userId: string, authHeader: string) {
    const rx = await this.fetchPrescription(tenantId, prescriptionOrderId, facilityId, userId, authHeader);

    const existing = await this.prisma.pharmacyDispensing.findFirst({
      where: { tenantId, prescriptionOrderId, status: { notIn: ['cancelled'] } },
      include: { items: true },
    });

    return {
      prescription: rx,
      dispensing: existing ?? null,
    };
  }

  private async fetchActivePrescriptions(
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
        this.httpService.get(`${this.clinicalServiceUrl}/prescriptions`, {
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
      this.logger.error(`Failed to fetch prescriptions from Clinical API: ${(error as Error).message}`);
      return [];
    }
  }

  private async fetchPrescription(tenantId: string, prescriptionId: string, facilityId: string, userId: string, authHeader: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescriptions/${prescriptionId}`, {
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
      this.logger.error(`Failed to fetch prescription ${prescriptionId}: ${(error as Error).message}`);
      return null;
    }
  }
}
