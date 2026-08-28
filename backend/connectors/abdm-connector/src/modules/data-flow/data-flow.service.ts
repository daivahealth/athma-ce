/**
 * Consented health-information provision — the HIP data flow (issue #116,
 * ABDM M2). An HIU's request arrives via the gateway callback; provision is
 * DENIED unless it points at a GRANTED, unexpired consent artefact we hold.
 * Approved requests are processed asynchronously: for each linked care
 * context of the consented patient, the encounter summary is fetched from
 * clinical (under explicit tenant scope), built into an NRCES FHIR bundle,
 * Fidelius-encrypted with a fresh sender key pair, and pushed to the HIU's
 * dataPushUrl. The gateway transfer notification fires best-effort on the
 * live path.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { FideliusCryptoService } from './fidelius-crypto.service';
import { FhirBundleService, EncounterSummary } from './fhir-bundle.service';
import { AbdmCredentialsService } from '../abha/abdm-credentials.service';
import { AbdmSessionService } from '../abha/abdm-session.service';
import { AbdmSettingsService } from '../abha/abdm-settings.service';
import type { AbdmScope } from '../abha/abdm-types';

interface HiRequestBody {
  transactionId?: string;
  hiRequest?: {
    consent?: { id?: string };
    dateRange?: { from?: string; to?: string };
    dataPushUrl?: string;
    keyMaterial?: {
      dhPublicKey?: { keyValue?: string };
      nonce?: string;
    };
  };
}

@Injectable()
export class DataFlowService {
  private readonly logger = new Logger(DataFlowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fidelius: FideliusCryptoService,
    private readonly fhir: FhirBundleService,
    private readonly credentials: AbdmCredentialsService,
    private readonly session: AbdmSessionService,
    private readonly settings: AbdmSettingsService,
  ) {}

  /** Consent-id lookup used by callback tenancy resolution. */
  async tenancyForConsent(consentId: string) {
    return this.prisma.consentArtefact.findUnique({ where: { consentId } });
  }

  async handleRequest(scope: AbdmScope, body: unknown): Promise<void> {
    const parsed = body as HiRequestBody;
    const transactionId = parsed?.transactionId;
    const consentId = parsed?.hiRequest?.consent?.id;
    const dataPushUrl = parsed?.hiRequest?.dataPushUrl;
    const hiuKey = parsed?.hiRequest?.keyMaterial?.dhPublicKey?.keyValue;
    const hiuNonce = parsed?.hiRequest?.keyMaterial?.nonce;

    if (!transactionId || !consentId || !dataPushUrl || !hiuKey || !hiuNonce) {
      throw new Error('Health-information request missing transactionId/consent/dataPushUrl/keyMaterial');
    }

    const existing = await this.prisma.dataRequest.findUnique({ where: { transactionId } });
    if (existing) {
      this.logger.debug(`HI request ${transactionId} already ${existing.status}`);
      return;
    }

    // The consent artefact is the authorization — no artefact, wrong tenant,
    // revoked, or expired means DENIED, recorded for audit.
    const consent = await this.prisma.consentArtefact.findUnique({ where: { consentId } });
    const expired = consent?.expiresAt ? consent.expiresAt.getTime() < Date.now() : false;
    const denied = !consent || consent.tenantId !== scope.tenantId || consent.status !== 'GRANTED' || expired;

    const request = await this.prisma.dataRequest.create({
      data: {
        transactionId,
        consentId,
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        dataPushUrl,
        keyMaterial: { publicKey: hiuKey, nonce: hiuNonce } as never,
        status: denied ? 'denied' : 'received',
        ...(denied
          ? { error: !consent ? 'unknown consent' : expired ? 'consent expired' : `consent ${consent.status}` }
          : {}),
      },
    });

    if (denied) {
      this.logger.warn(`HI request ${transactionId} DENIED: ${request.error}`);
      return;
    }

    // Async so the callback can 202 immediately; failures are recorded on the
    // request row for triage.
    setImmediate(() => {
      void this.provision(request.id).catch(async (error) => {
        const message = error instanceof Error ? error.message : String(error);
        await this.prisma.dataRequest.update({
          where: { id: request.id },
          data: { status: 'failed', error: message.slice(0, 1000) },
        });
        this.logger.error(`HI provision ${transactionId} FAILED: ${message}`);
      });
    });
  }

  async list(tenantId: string) {
    return this.prisma.dataRequest.findMany({
      where: { tenantId },
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
  }

  private async provision(requestId: string): Promise<void> {
    const request = await this.prisma.dataRequest.findUniqueOrThrow({ where: { id: requestId } });
    const consent = await this.prisma.consentArtefact.findUniqueOrThrow({
      where: { consentId: request.consentId },
    });

    const contexts = await this.prisma.careContext.findMany({
      where: { tenantId: request.tenantId, abhaAddress: consent.abhaAddress, status: 'linked' },
    });
    if (contexts.length === 0) {
      throw new Error(`No linked care contexts for ${consent.abhaAddress}`);
    }

    const hiuKeyMaterial = request.keyMaterial as { publicKey: string; nonce: string };
    const sender = this.fidelius.generateKeyMaterial();

    const entries = [];
    for (const context of contexts) {
      const summary = await this.fetchEncounterSummary(request.tenantId, context.careContextRef);
      const bundle = this.fhir.buildOpConsultBundle(summary, consent.abhaAddress);
      const payload = JSON.stringify(bundle);
      const content = this.fidelius.encrypt(payload, sender, hiuKeyMaterial.publicKey, hiuKeyMaterial.nonce);
      entries.push({
        content,
        media: 'application/fhir+json',
        checksum: crypto.createHash('sha256').update(payload).digest('base64'),
        careContextReference: context.careContextRef,
      });
    }

    await axios.post(
      request.dataPushUrl,
      {
        pageNumber: 1,
        pageCount: 1,
        transactionId: request.transactionId,
        entries,
        keyMaterial: {
          cryptoAlg: 'ECDH',
          curve: 'Curve25519',
          dhPublicKey: {
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            parameters: 'Curve25519/32byte random key',
            keyValue: sender.publicKey,
          },
          nonce: sender.nonce,
        },
      },
      { timeout: 60_000 },
    );

    await this.prisma.dataRequest.update({
      where: { id: requestId },
      data: { status: 'pushed', pushedAt: new Date(), contextsSent: entries.length },
    });
    this.logger.log(
      `HI provision ${request.transactionId}: pushed ${entries.length} encrypted care context(s)`,
    );

    await this.notifyGateway(request, entries.length);
  }

  /** Ids only in events and requests — clinical content is fetched per use. */
  private async fetchEncounterSummary(tenantId: string, encounterId: string): Promise<EncounterSummary> {
    const baseUrl = (process.env.CLINICAL_BASE_URL || 'http://localhost:3011').replace(/\/$/, '');
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) throw new Error('INTERNAL_API_KEY not configured');
    const response = await fetch(
      `${baseUrl}/api/v1/internal/encounters/${encounterId}/summary?tenantId=${tenantId}`,
      {
        headers: {
          'x-internal-api-key': apiKey,
          'x-service-name': 'abdm-connector',
          'x-tenant-id': tenantId,
        },
      },
    );
    if (!response.ok) throw new Error(`Encounter summary fetch failed with HTTP ${response.status}`);
    return (await response.json()) as EncounterSummary;
  }

  /** Gateway transfer notification — live path only, best-effort. */
  private async notifyGateway(
    request: { tenantId: string; facilityId: string | null; transactionId: string; consentId: string },
    sessionCount: number,
  ): Promise<void> {
    const scope: AbdmScope = {
      tenantId: request.tenantId,
      facilityId: request.facilityId ?? undefined,
    };
    const creds = await this.credentials.getCredentials(scope);
    if (!creds) return;
    try {
      const settings = await this.settings.getSettings(scope.tenantId);
      const token = await this.session.getAccessToken(settings.gatewayUrl, creds.clientId, creds.clientSecret);
      await axios.post(
        `${settings.gatewayUrl}/api/hiecm/v3/health-information/notify`,
        {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          notification: {
            consentId: request.consentId,
            transactionId: request.transactionId,
            doneAt: new Date().toISOString(),
            notifier: { type: 'HIP' },
            statusNotification: {
              sessionStatus: 'TRANSFERRED',
              statusResponses: [{ careContextReference: 'ALL', hiStatus: 'OK', sessionCount }],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'REQUEST-ID': crypto.randomUUID(),
            TIMESTAMP: new Date().toISOString(),
            'X-CM-ID': settings.cmId,
          },
          timeout: 20_000,
        },
      );
    } catch (error) {
      this.logger.warn(`Data-transfer notify failed for ${request.transactionId}: ${error}`);
    }
  }
}
