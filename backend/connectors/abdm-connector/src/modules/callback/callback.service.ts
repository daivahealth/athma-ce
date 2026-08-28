import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CorrelationService } from '../correlation/correlation.service';

export interface InboundCallback {
  path: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

interface ResolvedTenancy {
  tenantId: string;
  facilityId?: string | null;
  via: 'txn' | 'hip';
}

/**
 * Routes verified gateway callbacks to the owning tenant. Resolution order:
 *  1. transaction id (REQUEST-ID / request.requestId / resp.requestId) via the
 *     correlation store — covers responses to our own outbound requests;
 *  2. HIP id (X-HIP-ID header or payload hipId) via the facility mapping —
 *     covers gateway-initiated flows (discovery, consent notifications).
 * Anything else is quarantined, never guessed.
 *
 * The skeleton stops at resolution + logging; flow-specific processing
 * (ABHA results, care-context confirmations, consent artefacts) plugs in as
 * handlers with #96/#97 and M2.
 */
@Injectable()
export class CallbackService {
  private readonly logger = new Logger(CallbackService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly correlationService: CorrelationService,
  ) {}

  async handle(callback: InboundCallback): Promise<void> {
    const resolved = await this.resolveTenancy(callback);
    if (!resolved) {
      await this.quarantine(callback, 'unresolvable', 'No known transaction id or HIP id');
      return;
    }

    // Skeleton behavior: acknowledge the callback against its correlation and
    // log under restored tenant context. Flow handlers land with #96/#97.
    const txnId = this.extractTxnId(callback);
    if (resolved.via === 'txn' && txnId) {
      await this.correlationService.complete(txnId);
    }
    this.logger.log(
      `Callback ${callback.path} resolved via ${resolved.via} to tenant ${resolved.tenantId}` +
        (resolved.facilityId ? ` facility ${resolved.facilityId}` : ''),
    );
  }

  async quarantine(callback: InboundCallback, reason: string, detail?: string): Promise<void> {
    const safeHeaders: Record<string, unknown> = {};
    for (const name of ['request-id', 'x-request-id', 'x-hip-id', 'x-cm-id', 'timestamp']) {
      if (callback.headers[name] !== undefined) safeHeaders[name] = callback.headers[name];
    }
    await this.prisma.quarantinedCallback.create({
      data: {
        path: callback.path,
        reason,
        detail: detail ?? null,
        headers: safeHeaders as never,
        body: (callback.body ?? undefined) as never,
      },
    });
    this.logger.error(
      `QUARANTINED callback ${callback.path}: ${reason}${detail ? ` — ${detail}` : ''}`,
    );
  }

  async listQuarantined() {
    return this.prisma.quarantinedCallback.findMany({
      where: { resolvedAt: null },
      orderBy: { receivedAt: 'desc' },
      take: 200,
    });
  }

  async resolveQuarantined(id: string, resolvedBy: string) {
    return this.prisma.quarantinedCallback.update({
      where: { id },
      data: { resolvedAt: new Date(), resolvedBy },
    });
  }

  private async resolveTenancy(callback: InboundCallback): Promise<ResolvedTenancy | null> {
    const txnId = this.extractTxnId(callback);
    if (txnId) {
      const entry = await this.correlationService.resolve(txnId);
      if (entry) {
        return { tenantId: entry.tenantId, facilityId: entry.facilityId, via: 'txn' };
      }
    }

    const hipId = this.extractHipId(callback);
    if (hipId) {
      const mapping = await this.correlationService.getHipMapping(hipId);
      if (mapping) {
        return { tenantId: mapping.tenantId, facilityId: mapping.facilityId, via: 'hip' };
      }
    }

    return null;
  }

  private extractTxnId(callback: InboundCallback): string | undefined {
    const headerId = callback.headers['request-id'] ?? callback.headers['x-request-id'];
    if (typeof headerId === 'string' && headerId) return headerId;

    const body = callback.body as Record<string, any> | undefined;
    const candidate =
      body?.resp?.requestId ?? body?.response?.requestId ?? body?.requestId ?? body?.txnId;
    return typeof candidate === 'string' && candidate ? candidate : undefined;
  }

  private extractHipId(callback: InboundCallback): string | undefined {
    const header = callback.headers['x-hip-id'];
    if (typeof header === 'string' && header) return header;

    const body = callback.body as Record<string, any> | undefined;
    const candidate = body?.hip?.id ?? body?.hipId;
    return typeof candidate === 'string' && candidate ? candidate : undefined;
  }
}
