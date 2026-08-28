/**
 * NHCX / HCX claims exchange (issue #122, epic #98 Phase 5).
 *
 * Hosted as a cleanly-bounded module inside the india connector deployable
 * (ADR-0015: separate capability, shared platform primitives). Credentials
 * live in the TenantSecret store under owner 'nhcx' (facility-scoped, tenant
 * fallback, env fallback for single-tenant); exchanges correlate through the
 * shared correlation store; responses arrive on /callbacks/nhcx/*.
 *
 * Mock path (no credentials) answers instantly with a deterministic response
 * so RCM flows are demo/CI-able. Live path JWE-wraps the FHIR payload against
 * the payer's certificate and POSTs to the HCX gateway — wire shapes carry
 * the standing reconcile-on-sandbox caveat.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { HcxJweService } from './hcx-jwe.service';
import { CorrelationService } from '../correlation/correlation.service';
import { secretClient, configClient } from '../../config';
import type { AbdmScope } from '../abha/abdm-types';

export type ExchangeKind = 'eligibility' | 'preauth' | 'claim';

export interface SubmitInput {
  scope: AbdmScope;
  kind: ExchangeKind;
  /** HCX participant code of the payer. */
  recipientCode: string;
  /** Payer's encryption certificate (PEM) for the live JWE path. */
  recipientCertPem?: string | undefined;
  /** The FHIR payload (CoverageEligibilityRequest / Claim). */
  payload: Record<string, unknown>;
}

export type SubmitOutcome =
  | { status: 'responded'; correlationId: string; response: Record<string, unknown> }
  | { status: 'submitted'; correlationId: string };

const HCX_PATHS: Record<ExchangeKind, string> = {
  eligibility: '/coverageeligibility/check',
  preauth: '/preauth/submit',
  claim: '/claim/submit',
};

@Injectable()
export class NhcxService {
  private readonly logger = new Logger(NhcxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwe: HcxJweService,
    private readonly correlation: CorrelationService,
  ) {}

  async submit(input: SubmitInput): Promise<SubmitOutcome> {
    const correlationId = crypto.randomUUID();
    const apiCallId = crypto.randomUUID();
    const creds = await this.getCredentials(input.scope);

    const base = {
      correlationId,
      apiCallId,
      tenantId: input.scope.tenantId,
      facilityId: input.scope.facilityId ?? null,
      kind: input.kind,
      recipientCode: input.recipientCode,
      request: input.payload as never,
    };

    if (!creds) {
      const response = this.mockResponse(input.kind, correlationId);
      await this.prisma.nhcxExchange.create({
        data: {
          ...base,
          gateway: 'mock',
          status: 'responded',
          response: response as never,
          respondedAt: new Date(),
        },
      });
      this.logger.log(`NHCX ${input.kind} (mock) responded instantly (${correlationId})`);
      return { status: 'responded', correlationId, response };
    }

    if (!input.recipientCertPem) {
      throw new Error('recipientCertPem is required for live NHCX exchanges');
    }

    await this.prisma.nhcxExchange.create({
      data: { ...base, gateway: 'nhcx', status: 'submitted' },
    });
    await this.correlation.register({
      txnId: correlationId,
      flow: `nhcx.${input.kind}`,
      tenantId: input.scope.tenantId,
      facilityId: input.scope.facilityId,
      ttlSeconds: 24 * 60 * 60,
    });

    const headers = {
      'x-hcx-sender_code': creds.participantCode,
      'x-hcx-recipient_code': input.recipientCode,
      'x-hcx-api_call_id': apiCallId,
      'x-hcx-correlation_id': correlationId,
      'x-hcx-timestamp': new Date().toISOString(),
    };
    const jwePayload = this.jwe.encrypt(input.payload, headers, input.recipientCertPem);

    const baseUrl = String(
      (await configClient.get('nhcx.base_url', { tenantId: input.scope.tenantId })) ?? '',
    ).replace(/\/$/, '');
    await axios.post(
      `${baseUrl}${HCX_PATHS[input.kind]}`,
      { payload: jwePayload },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${creds.clientSecret}`,
        },
        timeout: 30_000,
      },
    );
    this.logger.log(`NHCX ${input.kind} submitted (${correlationId}) — awaiting on_${input.kind === 'eligibility' ? 'check' : 'submit'}`);
    return { status: 'submitted', correlationId };
  }

  /** Payer response arriving on /callbacks/nhcx/* (on_check / on_submit). */
  async handleResponse(body: unknown): Promise<void> {
    const parsed = body as { payload?: string } & Record<string, unknown>;
    let correlationId: string | undefined;
    let response: Record<string, unknown>;

    if (typeof parsed?.payload === 'string' && parsed.payload.split('.').length === 5) {
      const headers = this.jwe.readHeaders(parsed.payload);
      correlationId = String(headers['x-hcx-correlation_id'] ?? '');
      const privateKeyPem = await this.ourPrivateKey(correlationId);
      if (privateKeyPem) {
        response = this.jwe.decrypt(parsed.payload, privateKeyPem).payload;
      } else {
        response = { undecrypted: true, headers };
      }
    } else {
      correlationId = String(
        parsed?.['correlation_id'] ?? parsed?.['x-hcx-correlation_id'] ?? '',
      );
      response = parsed as Record<string, unknown>;
    }

    if (!correlationId) throw new Error('NHCX response missing correlation id');
    const exchange = await this.prisma.nhcxExchange.findUnique({ where: { correlationId } });
    if (!exchange) throw new Error(`Unknown NHCX correlation '${correlationId}'`);
    if (exchange.status === 'responded') return; // idempotent redelivery

    await this.prisma.nhcxExchange.update({
      where: { id: exchange.id },
      data: { status: 'responded', response: response as never, respondedAt: new Date() },
    });
    await this.correlation.complete(correlationId).catch(() => undefined);
    this.logger.log(`NHCX ${exchange.kind} response received (${correlationId})`);
  }

  async getExchange(tenantId: string, correlationId: string) {
    const exchange = await this.prisma.nhcxExchange.findUnique({ where: { correlationId } });
    if (!exchange || exchange.tenantId !== tenantId) return null;
    return exchange;
  }

  // ---------------------------------------------------------------- helpers

  private async getCredentials(
    scope: AbdmScope,
  ): Promise<{ participantCode: string; clientSecret: string } | null> {
    const ref = {
      tenantId: scope.tenantId,
      ...(scope.facilityId ? { facilityId: scope.facilityId } : {}),
      ownerId: 'nhcx',
    };
    const [participantCode, clientSecret] = await Promise.all([
      secretClient.getOptional({ ...ref, key: 'nhcx.participant_code' }),
      secretClient.getOptional({ ...ref, key: 'nhcx.client_secret' }),
    ]);
    if (participantCode && clientSecret) return { participantCode, clientSecret };
    if (process.env.NHCX_PARTICIPANT_CODE && process.env.NHCX_CLIENT_SECRET) {
      return {
        participantCode: process.env.NHCX_PARTICIPANT_CODE,
        clientSecret: process.env.NHCX_CLIENT_SECRET,
      };
    }
    return null;
  }

  /** Our participant decryption key (tenant-scoped secret), when configured. */
  private async ourPrivateKey(correlationId: string): Promise<string | undefined> {
    const exchange = await this.prisma.nhcxExchange.findUnique({ where: { correlationId } });
    if (!exchange) return undefined;
    return secretClient.getOptional({
      tenantId: exchange.tenantId,
      ...(exchange.facilityId ? { facilityId: exchange.facilityId } : {}),
      ownerId: 'nhcx',
      key: 'nhcx.encryption_private_key',
    });
  }

  private mockResponse(kind: ExchangeKind, correlationId: string): Record<string, unknown> {
    if (kind === 'eligibility') {
      return {
        resourceType: 'CoverageEligibilityResponse',
        status: 'active',
        outcome: 'complete',
        disposition: 'Policy is active; member is eligible (mock)',
        eligible: true,
        correlationId,
      };
    }
    if (kind === 'preauth') {
      return {
        resourceType: 'ClaimResponse',
        use: 'preauthorization',
        outcome: 'complete',
        disposition: 'Pre-authorization approved (mock)',
        preAuthRef: `PA-${correlationId.slice(0, 8).toUpperCase()}`,
        correlationId,
      };
    }
    return {
      resourceType: 'ClaimResponse',
      use: 'claim',
      outcome: 'queued',
      disposition: 'Claim acknowledged for adjudication (mock)',
      correlationId,
    };
  }
}
