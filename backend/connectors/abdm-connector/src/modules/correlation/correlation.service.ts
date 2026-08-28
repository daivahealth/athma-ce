import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const DEFAULT_TTL_SECONDS = 30 * 60;

export interface RegisterCorrelation {
  txnId: string;
  flow: string;
  tenantId: string;
  facilityId?: string | undefined;
  ttlSeconds?: number | undefined;
  metadata?: Record<string, unknown> | undefined;
}

/**
 * The correlation store: every outbound async gateway request registers its
 * transaction id → (tenant, facility) BEFORE the request leaves, and inbound
 * callbacks resolve tenancy exclusively through it. Payload-claimed tenancy
 * is never trusted.
 */
@Injectable()
export class CorrelationService {
  private readonly logger = new Logger(CorrelationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterCorrelation) {
    const ttl = input.ttlSeconds ?? DEFAULT_TTL_SECONDS;

    // Re-registering the same txnId refreshes the TTL but must never move it
    // to another tenant — checked before anything is written.
    const existing = await this.prisma.correlationEntry.findUnique({
      where: { txnId: input.txnId },
    });
    if (existing && existing.tenantId !== input.tenantId) {
      this.logger.error(`Refused cross-tenant re-registration of txnId ${input.txnId}`);
      throw new ConflictException(`Transaction '${input.txnId}' is already registered`);
    }

    return this.prisma.correlationEntry.upsert({
      where: { txnId: input.txnId },
      create: {
        txnId: input.txnId,
        flow: input.flow,
        tenantId: input.tenantId,
        facilityId: input.facilityId ?? null,
        metadata: (input.metadata ?? undefined) as never,
        expiresAt: new Date(Date.now() + ttl * 1000),
      },
      update: { expiresAt: new Date(Date.now() + ttl * 1000) },
    });
  }

  /** Resolves an unexpired correlation; returns null when unknown/expired. */
  async resolve(txnId: string) {
    const entry = await this.prisma.correlationEntry.findUnique({ where: { txnId } });
    if (!entry) return null;
    if (entry.expiresAt.getTime() < Date.now()) {
      if (entry.status === 'pending') {
        await this.prisma.correlationEntry.update({
          where: { id: entry.id },
          data: { status: 'expired' },
        });
      }
      return null;
    }
    return entry;
  }

  async complete(txnId: string, status: 'completed' | 'failed' = 'completed') {
    return this.prisma.correlationEntry.update({
      where: { txnId },
      data: { status, completedAt: new Date() },
    });
  }

  async getHipMapping(hipId: string) {
    return this.prisma.hipFacilityMapping.findUnique({ where: { hipId } });
  }

  async putHipMapping(hipId: string, tenantId: string, facilityId: string) {
    return this.prisma.hipFacilityMapping.upsert({
      where: { hipId },
      create: { hipId, tenantId, facilityId },
      update: { tenantId, facilityId },
    });
  }
}
