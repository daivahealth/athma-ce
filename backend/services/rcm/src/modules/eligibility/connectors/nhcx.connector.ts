/**
 * NHCX eligibility connector (issue #123) on RCM's existing per-payer
 * strategy seam: a payer whose configuration sets
 * `eligibilityConnector: "NHCX"` (plus `nhcxParticipantCode`, and
 * `nhcxEncryptionCert` for the live path) routes coverage-eligibility checks
 * through the india connector's HCX exchange. Mock exchanges answer
 * instantly; live exchanges are asynchronous — a pending exchange surfaces as
 * a non-success response with code NHCX_PENDING for the caller to retry.
 */

import { Injectable, Logger } from '@nestjs/common';
import {
    EligibilityCheckPayload,
    EligibilityCheckResponse,
    EligibilityConnector,
} from './eligibility-connector.interface';

@Injectable()
export class NhcxEligibilityConnector implements EligibilityConnector {
    readonly connectorId = 'NHCX';
    readonly displayName = 'NHCX (India claims exchange)';
    readonly supportedPayerTypes = ['insurance', 'tpa', 'government'];
    private readonly logger = new Logger(NhcxEligibilityConnector.name);

    async checkEligibility(payload: EligibilityCheckPayload): Promise<EligibilityCheckResponse> {
        const recipientCode = String(payload.payerMetadata?.['nhcxParticipantCode'] ?? '');
        if (!payload.tenantId || !recipientCode) {
            return this.failure('NHCX_MISCONFIGURED', 'Payer is missing nhcxParticipantCode configuration');
        }

        const baseUrl = (process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '');
        const apiKey = process.env.INTERNAL_API_KEY;
        if (!apiKey) return this.failure('NHCX_MISCONFIGURED', 'INTERNAL_API_KEY is not configured');

        const recipientCert = payload.payerMetadata?.['nhcxEncryptionCert'];
        let response: Response;
        try {
            response = await fetch(`${baseUrl}/api/v1/internal/nhcx/submit`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-internal-api-key': apiKey,
                    'x-service-name': 'rcm',
                },
                body: JSON.stringify({
                    tenantId: payload.tenantId,
                    ...(payload.facilityId ? { facilityId: payload.facilityId } : {}),
                    kind: 'eligibility',
                    recipientCode,
                    ...(typeof recipientCert === 'string' ? { recipientCertPem: recipientCert } : {}),
                    payload: this.buildCoverageEligibilityRequest(payload),
                }),
            });
        } catch (error) {
            this.logger.warn(`india connector unreachable: ${error}`);
            return this.failure('NHCX_UNAVAILABLE', 'Claims exchange is unavailable right now');
        }
        if (!response.ok) {
            return this.failure('NHCX_SUBMIT_FAILED', `Exchange submit failed with HTTP ${response.status}`);
        }

        const outcome = (await response.json()) as {
            status: 'responded' | 'submitted';
            correlationId: string;
            response?: Record<string, unknown>;
        };

        if (outcome.status === 'submitted') {
            // Live exchanges answer via callback; the check can be re-run and
            // will resolve from the exchange store once the payer responds.
            return this.failure('NHCX_PENDING', 'Awaiting payer response via NHCX — retry shortly');
        }

        const eligible =
            outcome.response?.['eligible'] === true || outcome.response?.['outcome'] === 'complete';
        return {
            success: true,
            isEligible: eligible,
            rawResponse: { correlationId: outcome.correlationId, ...outcome.response },
        };
    }

    /** Minimal FHIR CoverageEligibilityRequest; enriched with #124. */
    private buildCoverageEligibilityRequest(payload: EligibilityCheckPayload): Record<string, unknown> {
        return {
            resourceType: 'CoverageEligibilityRequest',
            status: 'active',
            purpose: ['validation', 'benefits'],
            patient: { reference: `Patient/${payload.patientId}` },
            ...(payload.memberId ? { insurance: [{ coverage: { identifier: { value: payload.memberId } } }] } : {}),
            ...(payload.serviceDate ? { servicedDate: new Date(payload.serviceDate).toISOString().slice(0, 10) } : {}),
            created: new Date().toISOString(),
        };
    }

    private failure(code: string, message: string): EligibilityCheckResponse {
        return { success: false, errors: [{ code, message }] };
    }
}
