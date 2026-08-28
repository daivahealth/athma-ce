/**
 * Processes the event inbox (issue #114): the polling consumer that turns
 * delivered domain events into ABDM actions. Same job-runner shape as the
 * clinical dispatcher; rows are idempotent by event id, attempts are bounded,
 * and permanently failing rows are marked 'failed' for operator triage.
 *
 * v1 handler: encounter.closed → build + link a care context when the patient
 * is ABHA-linked (resolved via clinical's internal API — event payloads carry
 * ids only). Other relevant types stay 'received' for future handlers.
 */

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CareContextService } from '../care-context/care-context.service';

const POLL_MS = 5_000;
const BATCH = 25;
const MAX_ATTEMPTS = 5;

@Injectable()
export class InboxProcessorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InboxProcessorService.name);
  private timer?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly careContexts: CareContextService,
  ) {}

  onModuleInit(): void {
    this.timer = setInterval(() => void this.tick(), POLL_MS);
    this.timer.unref?.();
    this.logger.log(`Event inbox processor polling every ${POLL_MS / 1000}s`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      const events = await this.prisma.eventInbox.findMany({
        where: { status: 'received' },
        orderBy: { seq: 'asc' },
        take: BATCH,
      });
      for (const event of events) {
        await this.process(event);
      }
    } catch (error) {
      this.logger.error(`Inbox processing cycle failed: ${error}`);
    } finally {
      this.running = false;
    }
  }

  private async process(event: {
    id: string;
    eventId: string;
    eventType: string;
    tenantId: string;
    facilityId: string | null;
    payload: unknown;
    attempts: number;
  }): Promise<void> {
    try {
      const outcome = await this.handle(event);
      await this.prisma.eventInbox.update({
        where: { id: event.id },
        data: { status: outcome, processedAt: new Date(), error: null },
      });
    } catch (error) {
      const attempts = event.attempts + 1;
      const terminal = attempts >= MAX_ATTEMPTS;
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.eventInbox.update({
        where: { id: event.id },
        data: {
          attempts,
          ...(terminal ? { status: 'failed', processedAt: new Date() } : {}),
          error: message.slice(0, 1000),
        },
      });
      this.logger[terminal ? 'error' : 'warn'](
        `${terminal ? 'FAILED' : 'Retryable failure on'} inbox event ${event.eventType} (${event.eventId}), attempt ${attempts}: ${message}`,
      );
    }
  }

  /** Returns the terminal inbox status for a successfully handled event. */
  private async handle(event: {
    eventType: string;
    tenantId: string;
    facilityId: string | null;
    payload: unknown;
  }): Promise<'processed' | 'ignored'> {
    if (event.eventType !== 'encounter.closed') {
      // patient.identity.linked etc. have no side effects yet — keep the
      // trace, nothing to do.
      return 'processed';
    }

    const payload = event.payload as { encounterId?: string; patientId?: string };
    if (!payload?.encounterId || !payload?.patientId) return 'ignored';

    const abha = await this.fetchAbha(event.tenantId, payload.patientId);
    if (!abha?.abhaAddress) {
      // Not ABHA-linked — perfectly normal; nothing to link.
      return 'ignored';
    }

    await this.careContexts.linkEncounter({
      scope: { tenantId: event.tenantId, facilityId: event.facilityId ?? undefined },
      patientId: payload.patientId,
      abhaAddress: abha.abhaAddress,
      careContextRef: payload.encounterId,
      display: `Encounter on ${new Date().toISOString().slice(0, 10)}`,
    });
    return 'processed';
  }

  /** Event payloads carry ids only — the ABHA linkage is fetched on demand. */
  private async fetchAbha(
    tenantId: string,
    patientId: string,
  ): Promise<{ abhaAddress?: string | null } | null> {
    const baseUrl = (process.env.CLINICAL_BASE_URL || 'http://localhost:3011').replace(/\/$/, '');
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) throw new Error('INTERNAL_API_KEY not configured');

    const response = await fetch(
      `${baseUrl}/api/v1/internal/national-identity/patients/${patientId}/abha?tenantId=${tenantId}`,
      {
        headers: {
          'x-internal-api-key': apiKey,
          'x-service-name': 'abdm-connector',
          // Clinical's tenant middleware reads the header; the query param is
          // what the endpoint itself scopes by.
          'x-tenant-id': tenantId,
        },
      },
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`ABHA lookup failed with HTTP ${response.status}`);
    return (await response.json()) as { abhaAddress?: string | null };
  }
}
