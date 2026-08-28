/**
 * ABDM implementation of the HieProvider seam (issue #83, ABDM M3) — the
 * "real provider" ADR-0012's amendment anticipated. Thin client of the
 * abdm-connector, which owns consent requests, transfer key material, and
 * decryption; this class only translates outcomes onto the seam:
 *
 *  - completed  → normalised ExternalHealthRecord[]
 *  - consent_pending / transfer_pending → HieProviderError(retryable) so the
 *    existing HieFetchJob machinery retries later
 *
 * patientReference is the ABHA address; when absent it is resolved from the
 * patient's stored ABHA identity.
 */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  ExternalHealthRecord,
  HieFetchRequest,
  HieFetchResponse,
  HieProvider,
  HieProviderError,
} from './hie-provider.interface';

interface ConnectorRecord {
  externalId: string;
  recordType: string;
  title: string;
  sourceSystem: string;
  issuedAt?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AbdmHieProvider implements HieProvider {
  readonly name = 'abdm';
  private readonly logger = new Logger(AbdmHieProvider.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchRecords(request: HieFetchRequest): Promise<HieFetchResponse> {
    const abhaAddress = request.patientReference ?? (await this.resolveAbha(request));
    if (!abhaAddress) {
      throw new HieProviderError(
        'ABDM_NO_ABHA',
        'Patient has no ABHA address — link an ABHA before fetching ABDM records',
        false,
      );
    }

    const outcome = await this.callConnector(request.tenantId, abhaAddress);
    if (outcome.status === 'completed') {
      return { provider: this.name, records: outcome.records.map((r) => this.toRecord(r)) };
    }

    // Async by nature: the job machinery retries; a later attempt finds the
    // granted consent / received transfer and completes.
    throw new HieProviderError(
      outcome.status === 'consent_pending' ? 'ABDM_CONSENT_PENDING' : 'ABDM_TRANSFER_PENDING',
      outcome.status === 'consent_pending'
        ? 'Waiting for the patient to approve the consent request'
        : 'Waiting for the HIP to push the requested records',
      true,
    );
  }

  private async resolveAbha(request: HieFetchRequest): Promise<string | undefined> {
    const identity = await this.prisma.patientIdentity.findFirst({
      where: {
        tenantId: request.tenantId,
        patientId: request.patientId,
        country: 'IN',
        identityType: 'abha',
      },
      orderBy: { createdAt: 'desc' },
    });
    return identity?.secondaryValue ?? undefined;
  }

  private async callConnector(
    tenantId: string,
    abhaAddress: string,
  ): Promise<
    | { status: 'completed'; records: ConnectorRecord[] }
    | { status: 'consent_pending' | 'transfer_pending' }
  > {
    const baseUrl = (process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '');
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) {
      throw new HieProviderError('ABDM_NOT_CONFIGURED', 'INTERNAL_API_KEY is not configured', false);
    }
    let response: Response;
    try {
      response = await fetch(`${baseUrl}/api/v1/internal/hiu/fetch`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-internal-api-key': apiKey,
          'x-service-name': 'clinical',
        },
        body: JSON.stringify({ tenantId, abhaAddress }),
      });
    } catch (error) {
      this.logger.warn(`abdm-connector unreachable: ${error}`);
      throw new HieProviderError('ABDM_CONNECTOR_UNAVAILABLE', 'ABDM connector unreachable', true);
    }
    if (!response.ok) {
      throw new HieProviderError(
        'ABDM_FETCH_FAILED',
        `ABDM fetch failed with HTTP ${response.status}`,
        response.status >= 500,
      );
    }
    return (await response.json()) as never;
  }

  private toRecord(record: ConnectorRecord): ExternalHealthRecord {
    return {
      externalId: record.externalId,
      recordType: record.recordType,
      title: record.title,
      sourceSystem: record.sourceSystem,
      ...(record.issuedAt ? { issuedAt: record.issuedAt } : {}),
      ...(record.metadata ? { metadata: record.metadata } : {}),
    };
  }
}
