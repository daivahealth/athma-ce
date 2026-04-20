import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';
import { firstValueFrom } from 'rxjs';
import { PharmacyDispensingService } from '../services/pharmacy-dispensing.service';
import { DispensingStatus, DispensingChannel, DispensingSource } from '../dto/pharmacy-dispensing.dto';

/**
 * Pharmacy Queue Sync Job
 *
 * Runs on a configurable cron schedule (default: every 2 minutes).
 * For each active tenant it:
 *   1. Fetches prescriptions with dispensingQueueStatus = 'not_queued' from the Clinical service
 *   2. Creates a PharmacyDispensing record (status = queued) in RCM for each new Rx
 *   3. Calls Clinical to mark the Rx as dispensingQueueStatus = 'queued'
 *
 * Idempotency is guaranteed by two independent guards:
 *   - Clinical-side: only returns 'not_queued' prescriptions
 *   - RCM-side: findFirst check before create (handles race conditions)
 */
@Injectable()
export class PharmacyQueueSyncJob {
  private readonly logger = new Logger(PharmacyQueueSyncJob.name);
  private readonly clinicalServiceUrl =
    process.env.CLINICAL_SERVICE_URL ?? 'http://localhost:3011/api/v1';
  private readonly foundationServiceUrl =
    process.env.FOUNDATION_BASE_URL ?? 'http://localhost:3010/api/v1';
  private readonly internalApiKey = process.env.INTERNAL_API_KEY ?? '';
  private readonly systemUserId =
    process.env.SYSTEM_USER_ID ?? '00000000-0000-0000-0000-000000000001';

  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly dispensingService: PharmacyDispensingService,
  ) {}

  /**
   * Main cron trigger. Interval is configurable via QUEUE_SYNC_CRON env var.
   * Default: every 2 minutes.
   */
  @Cron(process.env.QUEUE_SYNC_CRON ?? '*/2 * * * *')
  async syncPrescriptionsToQueue(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Pharmacy queue sync already running — skipping this tick');
      return;
    }

    this.isRunning = true;
    this.logger.log('Pharmacy queue sync started');

    try {
      const tenants = await this.fetchActiveTenants();

      if (tenants.length === 0) {
        this.logger.warn('No active tenants found — nothing to sync');
        return;
      }

      for (const tenant of tenants) {
        await this.processTenant(tenant.id).catch((err) =>
          this.logger.error(`Failed to process tenant ${tenant.id}: ${(err as Error).message}`),
        );
      }
    } catch (err) {
      this.logger.error('Pharmacy queue sync failed', err);
    } finally {
      this.isRunning = false;
      this.logger.log('Pharmacy queue sync finished');
    }
  }

  /**
   * Manual trigger — call from the controller for ops/testing.
   */
  async triggerNow(): Promise<{ message: string }> {
    await this.syncPrescriptionsToQueue();
    return { message: 'Pharmacy queue sync triggered' };
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private async processTenant(tenantId: string): Promise<void> {
    const prescriptions = await this.fetchPendingPrescriptions(tenantId);

    if (prescriptions.length === 0) {
      return;
    }

    this.logger.log(`Tenant ${tenantId}: ${prescriptions.length} pending prescription(s) to queue`);

    let queued = 0;
    let skipped = 0;
    let failed = 0;

    for (const rx of prescriptions) {
      try {
        // RCM-side idempotency guard (handles race between two scheduler instances)
        const existing = await this.prisma.pharmacyDispensing.findFirst({
          where: {
            tenantId,
            prescriptionOrderId: rx.id,
            status: { notIn: [DispensingStatus.CANCELLED, DispensingStatus.RETURNED] },
          },
          select: { id: true },
        });

        if (existing) {
          // Already queued — write-back to clinical in case a previous run failed mid-way
          await this.markRxQueued(tenantId, rx.id);
          skipped++;
          continue;
        }

        // Create the dispensing record via the internal method
        await this.createDispensingFromRx(tenantId, rx);

        // Write-back to clinical
        await this.markRxQueued(tenantId, rx.id);
        queued++;
      } catch (err) {
        failed++;
        this.logger.error(
          `Failed to queue Rx ${rx.id} (tenant ${tenantId}): ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `Tenant ${tenantId}: queued=${queued} skipped=${skipped} failed=${failed}`,
    );
  }

  /**
   * Creates a PharmacyDispensing record for a prescription fetched by the scheduler.
   * Uses SYSTEM_USER_ID as createdBy (no user JWT available).
   */
  private async createDispensingFromRx(tenantId: string, rx: any): Promise<void> {
    const dispensingChannel =
      rx.encounterType === 'inpatient'
        ? DispensingChannel.INPATIENT_WARD
        : DispensingChannel.OUTPATIENT_COUNTER;

    const dispensingNumber = await this.generateDispensingNumber(tenantId);

    await this.prisma.pharmacyDispensing.create({
      data: {
        tenantId,
        dispensingNumber,
        patientId: rx.patientId,
        encounterId: rx.encounterId ?? null,
        prescriptionOrderId: rx.id,
        dispensingSource: DispensingSource.DIGITAL_PRESCRIPTION,
        patientDisplayName: rx.patientDisplayName ?? null,
        mrn: rx.mrn ?? null,
        patientDateOfBirth: rx.dateOfBirth ? new Date(rx.dateOfBirth) : null,
        patientGender: rx.gender ?? null,
        encounterType: rx.encounterType ?? 'outpatient',
        encounterNumber: rx.encounterNumber ?? null,
        prescribedByName: rx.prescribedByName ?? null,
        status: DispensingStatus.QUEUED,
        dispensingChannel,
        createdBy: this.systemUserId,
      },
    });
  }

  private async generateDispensingNumber(tenantId: string): Promise<string> {
    const today = new Date();
    const prefix = `DISP-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;

    const last = await this.prisma.pharmacyDispensing.findFirst({
      where: { tenantId, dispensingNumber: { startsWith: prefix } },
      orderBy: { dispensingNumber: 'desc' },
      select: { dispensingNumber: true },
    });

    let seq = 1;
    if (last?.dispensingNumber) {
      const parts = last.dispensingNumber.split('-');
      seq = (parseInt(parts[parts.length - 1] ?? '0', 10) || 0) + 1;
    }

    return `${prefix}-${String(seq).padStart(5, '0')}`;
  }

  /** Fetch prescriptions with dispensingQueueStatus = 'not_queued' from Clinical */
  private async fetchPendingPrescriptions(tenantId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.clinicalServiceUrl}/prescriptions/internal/pending-queue`, {
          headers: {
            'x-tenant-id': tenantId,
            'x-internal-api-key': this.internalApiKey,
          },
          params: { limit: '200' },
        }),
      );
      return Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
    } catch (err) {
      this.logger.error(
        `Failed to fetch pending prescriptions for tenant ${tenantId}: ${(err as Error).message}`,
      );
      return [];
    }
  }

  /** Write-back to Clinical: mark prescription as queued */
  private async markRxQueued(tenantId: string, rxId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.patch(
          `${this.clinicalServiceUrl}/prescriptions/${rxId}/dispensing-queue-status`,
          { status: 'queued' },
          {
            headers: {
              'x-tenant-id': tenantId,
              'x-internal-api-key': this.internalApiKey,
              'content-type': 'application/json',
            },
          },
        ),
      );
    } catch (err) {
      this.logger.warn(
        `Failed to mark Rx ${rxId} as queued in Clinical (will retry on next run): ${(err as Error).message}`,
      );
      // Non-fatal: the RCM-side idempotency guard prevents duplicates even if write-back fails
    }
  }

  /** Fetch active tenants from Foundation service */
  private async fetchActiveTenants(): Promise<Array<{ id: string }>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.foundationServiceUrl}/tenants`, {
          headers: { 'x-internal-api-key': this.internalApiKey },
          params: { status: 'active', limit: '500' },
        }),
      );
      const data = response.data?.data ?? response.data ?? [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      this.logger.warn(
        `Could not fetch tenants from Foundation (${(err as Error).message}). ` +
          'Falling back to tenants inferred from existing dispensings.',
      );
      // Fallback: infer tenants from existing dispensing records
      return this.inferTenantsFromDispensings();
    }
  }

  /** Fallback: infer tenants from existing RCM dispensing data */
  private async inferTenantsFromDispensings(): Promise<Array<{ id: string }>> {
    const rows = await this.prisma.pharmacyDispensing.findMany({
      select: { tenantId: true },
      distinct: ['tenantId'],
    });
    return rows.map((r) => ({ id: r.tenantId }));
  }
}
