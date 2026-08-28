/**
 * HIU (Health Information User) flows — ABDM M3 (issue #83).
 *
 * fetch(scope, abhaAddress): ensure a GRANTED consent (mock: auto-granted and
 * mirrored into consent_artefacts so the loopback HIP path authorizes it;
 * live: consent-request init via the gateway, returns 'consent_pending' until
 * the CM notifies), then raise a health-information request with fresh
 * transfer-scoped key material. The HIP pushes to our public hiu/push
 * callback; receivePush() decrypts with the stored private key, verifies
 * checksums, normalises the FHIR bundles, and ERASES the private key.
 *
 * Mock path is a real loopback: the HI request is POSTed to our own public
 * ingress, so the entire M2 HIP provision path (consent gating, FHIR build,
 * Fidelius encryption) serves the M3 fetch — both sides of the crypto run for
 * real. Live gateway shapes carry the standing reconciliation caveat.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { FideliusCryptoService } from '../data-flow/fidelius-crypto.service';
import { AbdmCredentialsService } from '../abha/abdm-credentials.service';
import { AbdmSessionService } from '../abha/abdm-session.service';
import { AbdmSettingsService } from '../abha/abdm-settings.service';
import { CorrelationService } from '../correlation/correlation.service';
import type { AbdmScope } from '../abha/abdm-types';

export interface NormalizedRecord {
  externalId: string;
  recordType: string;
  title: string;
  sourceSystem: string;
  issuedAt?: string | undefined;
  metadata: Record<string, unknown>;
}

export type FetchOutcome =
  | { status: 'completed'; transactionId: string; records: NormalizedRecord[] }
  | { status: 'consent_pending' | 'transfer_pending'; transactionId?: string; consentRequestId?: string };

const MOCK_WAIT_MS = 8_000;

@Injectable()
export class HiuService {
  private readonly logger = new Logger(HiuService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fidelius: FideliusCryptoService,
    private readonly credentials: AbdmCredentialsService,
    private readonly session: AbdmSessionService,
    private readonly settings: AbdmSettingsService,
    private readonly correlation: CorrelationService,
  ) {}

  async fetch(scope: AbdmScope, abhaAddress: string, purpose: string): Promise<FetchOutcome> {
    const consent = await this.ensureConsent(scope, abhaAddress, purpose);
    if (!consent.artefactId) {
      return { status: 'consent_pending', consentRequestId: consent.requestId };
    }
    return this.requestHealthInformation(scope, abhaAddress, consent.artefactId);
  }

  async getTransfer(tenantId: string, transactionId: string) {
    const transfer = await this.prisma.hiuTransfer.findUnique({ where: { transactionId } });
    if (!transfer || transfer.tenantId !== tenantId) return null;
    const { privateKey: _omit, ...safe } = transfer;
    return safe;
  }

  /** The HIP's encrypted push arriving on our public hiu/push callback. */
  async receivePush(body: unknown): Promise<void> {
    const push = body as {
      transactionId?: string;
      entries?: Array<{ content?: string; checksum?: string; careContextReference?: string }>;
      keyMaterial?: { dhPublicKey?: { keyValue?: string }; nonce?: string };
    };
    if (!push?.transactionId) throw new Error('Push missing transactionId');

    const transfer = await this.prisma.hiuTransfer.findUnique({
      where: { transactionId: push.transactionId },
    });
    if (!transfer) throw new Error(`Unknown transfer '${push.transactionId}'`);
    if (transfer.status === 'received') return; // idempotent redelivery

    const senderKey = push.keyMaterial?.dhPublicKey?.keyValue;
    const senderNonce = push.keyMaterial?.nonce;
    if (!transfer.privateKey || !senderKey || !senderNonce || !Array.isArray(push.entries)) {
      throw new Error('Push missing key material or entries');
    }

    const privateKey = crypto.createPrivateKey({
      key: Buffer.from(transfer.privateKey, 'base64'),
      format: 'der',
      type: 'pkcs8',
    });

    const records: NormalizedRecord[] = [];
    for (const entry of push.entries) {
      if (!entry.content) continue;
      const payload = this.fidelius.decrypt(
        entry.content,
        privateKey,
        transfer.nonce,
        senderKey,
        senderNonce,
      );
      const checksumOk =
        !entry.checksum ||
        crypto.createHash('sha256').update(payload).digest('base64') === entry.checksum;
      if (!checksumOk) throw new Error(`Checksum mismatch for ${entry.careContextReference}`);
      records.push(this.normalize(JSON.parse(payload), entry.careContextReference));
    }

    await this.prisma.hiuTransfer.update({
      where: { id: transfer.id },
      data: {
        status: 'received',
        receivedAt: new Date(),
        records: records as never,
        privateKey: null, // transfer-scoped key erased on success
      },
    });
    this.logger.log(
      `HIU transfer ${push.transactionId}: received + decrypted ${records.length} record(s)`,
    );
  }

  // ------------------------------------------------------------------ steps

  private async ensureConsent(
    scope: AbdmScope,
    abhaAddress: string,
    purpose: string,
  ): Promise<{ artefactId?: string; requestId: string }> {
    const granted = await this.prisma.hiuConsentRequest.findFirst({
      where: { tenantId: scope.tenantId, abhaAddress, status: 'GRANTED' },
      orderBy: { createdAt: 'desc' },
    });
    if (granted?.consentArtefactId) {
      return { artefactId: granted.consentArtefactId, requestId: granted.id };
    }

    const pending = await this.prisma.hiuConsentRequest.findFirst({
      where: { tenantId: scope.tenantId, abhaAddress, status: 'REQUESTED' },
    });
    if (pending) return { requestId: pending.id };

    const creds = await this.credentials.getCredentials(scope);
    if (!creds) {
      // Mock: auto-grant, and mirror into consent_artefacts so the loopback
      // HIP provision authorizes against it (self-HIP demo scenario).
      const artefactId = crypto.randomUUID();
      const request = await this.prisma.hiuConsentRequest.create({
        data: {
          tenantId: scope.tenantId,
          facilityId: scope.facilityId ?? null,
          abhaAddress,
          purpose,
          hiTypes: ['OPConsultation'] as never,
          status: 'GRANTED',
          consentArtefactId: artefactId,
          gateway: 'mock',
        },
      });
      await this.prisma.consentArtefact.upsert({
        where: { consentId: artefactId },
        create: {
          consentId: artefactId,
          tenantId: scope.tenantId,
          facilityId: scope.facilityId ?? null,
          abhaAddress,
          status: 'GRANTED',
          hiTypes: ['OPConsultation'] as never,
          artefact: { mock: true, purpose } as never,
          surfaced: true,
        },
        update: { status: 'GRANTED' },
      });
      this.logger.log(`Mock consent auto-granted for ${abhaAddress} (${artefactId})`);
      return { artefactId, requestId: request.id };
    }

    // Live: async consent-request init; GRANTED arrives via hiu on-notify.
    const requestId = crypto.randomUUID();
    const request = await this.prisma.hiuConsentRequest.create({
      data: {
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        abhaAddress,
        purpose,
        hiTypes: ['OPConsultation'] as never,
        status: 'REQUESTED',
        gateway: 'abdm',
      },
    });
    await this.correlation.register({
      txnId: requestId,
      flow: 'hiu.consent-init',
      tenantId: scope.tenantId,
      facilityId: scope.facilityId,
      ttlSeconds: 24 * 60 * 60,
      metadata: { hiuConsentRequestId: request.id },
    });
    const settings = await this.settings.getSettings(scope.tenantId);
    const token = await this.session.getAccessToken(settings.gatewayUrl, creds.clientId, creds.clientSecret);
    await axios.post(
      `${settings.gatewayUrl}/api/hiecm/v3/consent-requests/init`,
      {
        requestId,
        timestamp: new Date().toISOString(),
        consent: {
          purpose: { text: purpose, code: 'CAREMGT' },
          patient: { id: abhaAddress },
          hiTypes: ['OPConsultation'],
          permission: {
            accessMode: 'VIEW',
            dateRange: { from: '2000-01-01T00:00:00Z', to: new Date().toISOString() },
            dataEraseAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            frequency: { unit: 'HOUR', value: 1, repeats: 0 },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'REQUEST-ID': requestId,
          TIMESTAMP: new Date().toISOString(),
          'X-CM-ID': settings.cmId,
        },
        timeout: 30_000,
      },
    );
    return { requestId: request.id };
  }

  private async requestHealthInformation(
    scope: AbdmScope,
    abhaAddress: string,
    consentArtefactId: string,
  ): Promise<FetchOutcome> {
    const sender = this.fidelius.generateKeyMaterial();
    const transactionId = crypto.randomUUID();
    const privateKeyDer = sender.privateKey
      .export({ type: 'pkcs8', format: 'der' })
      .toString('base64');

    await this.prisma.hiuTransfer.create({
      data: {
        transactionId,
        consentArtefactId,
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        abhaAddress,
        privateKey: privateKeyDer,
        nonce: sender.nonce,
      },
    });
    await this.correlation.register({
      txnId: transactionId,
      flow: 'hiu.data-request',
      tenantId: scope.tenantId,
      facilityId: scope.facilityId,
      ttlSeconds: 24 * 60 * 60,
    });

    const selfBase = (process.env.ABDM_CONNECTOR_PUBLIC_URL || `http://127.0.0.1:${process.env.PORT || 3016}`).replace(/\/$/, '');
    const dataPushUrl = `${selfBase}/api/v1/callbacks/abdm/v3/health-information/hiu/push`;
    const hiRequest = {
      transactionId,
      hiRequest: {
        consent: { id: consentArtefactId },
        dateRange: { from: '2000-01-01T00:00:00Z', to: new Date().toISOString() },
        dataPushUrl,
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
    };

    const creds = await this.credentials.getCredentials(scope);
    if (!creds) {
      // Mock loopback: our own public ingress plays the HIP — the whole M2
      // provision path (consent gate, FHIR build, encryption) serves this fetch.
      await axios.post(`${selfBase}/api/v1/callbacks/abdm/v3/health-information/hip/request`, hiRequest, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer eyJhbGciOiJSUzI1NiJ9.e30.bW9jaw',
        },
        timeout: 30_000,
      });
    } else {
      const settings = await this.settings.getSettings(scope.tenantId);
      const token = await this.session.getAccessToken(settings.gatewayUrl, creds.clientId, creds.clientSecret);
      await axios.post(
        `${settings.gatewayUrl}/api/hiecm/v3/health-information/cm/request`,
        { requestId: crypto.randomUUID(), timestamp: new Date().toISOString(), ...hiRequest },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'REQUEST-ID': crypto.randomUUID(),
            TIMESTAMP: new Date().toISOString(),
            'X-CM-ID': settings.cmId,
          },
          timeout: 30_000,
        },
      );
    }

    // Brief wait so the mock loopback (and a fast HIP) completes within one call.
    const deadline = Date.now() + MOCK_WAIT_MS;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const transfer = await this.prisma.hiuTransfer.findUnique({ where: { transactionId } });
      if (transfer?.status === 'received') {
        return {
          status: 'completed',
          transactionId,
          records: (transfer.records as unknown as NormalizedRecord[]) ?? [],
        };
      }
      if (transfer?.status === 'failed') break;
    }
    return { status: 'transfer_pending', transactionId };
  }

  private normalize(bundle: Record<string, any>, careContextRef?: string): NormalizedRecord {
    const entries: any[] = Array.isArray(bundle?.entry) ? bundle.entry : [];
    const composition = entries.find((e) => e?.resource?.resourceType === 'Composition')?.resource;
    return {
      externalId: careContextRef ?? bundle?.id ?? crypto.randomUUID(),
      recordType: 'consultation',
      title: composition?.title ?? 'External health record',
      sourceSystem: 'ABDM',
      issuedAt: composition?.date,
      metadata: {
        bundleId: bundle?.id,
        careContextReference: careContextRef,
        bundle,
      },
    };
  }
}
