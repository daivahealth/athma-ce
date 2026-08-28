/**
 * RCM's client for the india connector's NHCX exchange API (issue #124).
 * Shared by the eligibility connector, preauth and claims services. A payer
 * participates when its configuration carries `nhcxParticipantCode`
 * (+ `nhcxEncryptionCert` for the live path).
 */

import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';

export type NhcxKind = 'eligibility' | 'preauth' | 'claim';

export interface NhcxSubmitOutcome {
    status: 'responded' | 'submitted';
    correlationId: string;
    response?: Record<string, unknown>;
}

export interface NhcxExchangeRow {
    correlationId: string;
    kind: NhcxKind;
    status: 'submitted' | 'responded' | 'error';
    gateway: string;
    response?: Record<string, unknown> | null;
    error?: string | null;
}

@Injectable()
export class NhcxExchangeClient {
    private readonly logger = new Logger(NhcxExchangeClient.name);

    /** True when the payer's configuration routes this exchange through NHCX. */
    isNhcxPayer(payerConfig: Record<string, unknown> | null | undefined): boolean {
        return typeof payerConfig?.['nhcxParticipantCode'] === 'string' && !!payerConfig['nhcxParticipantCode'];
    }

    async submit(input: {
        tenantId: string;
        facilityId?: string | undefined;
        kind: NhcxKind;
        payerConfig: Record<string, unknown>;
        payload: Record<string, unknown>;
        sourceRef?: string | undefined;
    }): Promise<NhcxSubmitOutcome> {
        const body = {
            tenantId: input.tenantId,
            ...(input.facilityId ? { facilityId: input.facilityId } : {}),
            kind: input.kind,
            recipientCode: String(input.payerConfig['nhcxParticipantCode']),
            ...(typeof input.payerConfig['nhcxEncryptionCert'] === 'string'
                ? { recipientCertPem: input.payerConfig['nhcxEncryptionCert'] }
                : {}),
            payload: input.payload,
            ...(input.sourceRef ? { sourceRef: input.sourceRef } : {}),
        };
        const response = await this.call('POST', '/internal/nhcx/submit', body);
        return response as NhcxSubmitOutcome;
    }

    async getBySourceRef(tenantId: string, sourceRef: string): Promise<NhcxExchangeRow[]> {
        const response = (await this.call(
            'GET',
            `/internal/nhcx/exchanges/${tenantId}/by-source/${encodeURIComponent(sourceRef)}`,
        )) as { data: NhcxExchangeRow[] };
        return response.data ?? [];
    }

    private async call(method: string, path: string, body?: unknown): Promise<unknown> {
        const baseUrl = (process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '');
        const apiKey = process.env.INTERNAL_API_KEY;
        if (!apiKey) {
            throw new ServiceUnavailableException('INTERNAL_API_KEY is not configured — cannot reach the claims exchange');
        }
        let response: Response;
        try {
            response = await fetch(`${baseUrl}/api/v1${path}`, {
                method,
                headers: {
                    'content-type': 'application/json',
                    'x-internal-api-key': apiKey,
                    'x-service-name': 'rcm',
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });
        } catch (error) {
            this.logger.warn(`Claims exchange unreachable: ${error}`);
            throw new ServiceUnavailableException('Claims exchange is unavailable right now');
        }
        if (!response.ok) {
            throw new ServiceUnavailableException(`Claims exchange request failed with HTTP ${response.status}`);
        }
        return response.json();
    }
}
