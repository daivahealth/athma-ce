/**
 * HIE-CM consent handling (issue #115, ABDM M2).
 *
 * The consent manager notifies the HIP when a patient grants/revokes consent
 * for their records. The artefact is stored verbatim here (the authorization
 * every later data provision points back to) and surfaced into the core
 * consent module as a generic PatientConsent record via clinical's internal
 * API — core stores state, the connector stores protocol (ADR-0015).
 *
 * Notification shape follows the documented v3 contract
 * (notification.consentDetail / status) with the usual reconciliation caveat;
 * the gateway on-notify acknowledgment is fired best-effort on the live path.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AbdmCredentialsService } from '../abha/abdm-credentials.service';
import { AbdmSessionService } from '../abha/abdm-session.service';
import { AbdmSettingsService } from '../abha/abdm-settings.service';
import type { AbdmScope } from '../abha/abdm-types';

interface ConsentNotification {
  notification?: {
    status?: string;
    consentId?: string;
    consentDetail?: {
      consentId?: string;
      patient?: { id?: string };
      hip?: { id?: string };
      hiTypes?: string[];
      permission?: {
        dateRange?: { from?: string; to?: string };
        dataEraseAt?: string;
      };
      purpose?: { text?: string; code?: string };
    };
  };
  requestId?: string;
}

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly credentials: AbdmCredentialsService,
    private readonly session: AbdmSessionService,
    private readonly settings: AbdmSettingsService,
  ) {}

  async handleNotification(scope: AbdmScope, body: unknown): Promise<void> {
    const parsed = body as ConsentNotification;
    const detail = parsed?.notification?.consentDetail;
    const consentId = detail?.consentId ?? parsed?.notification?.consentId;
    const abhaAddress = detail?.patient?.id;
    const status = (parsed?.notification?.status ?? 'GRANTED').toUpperCase();

    if (!consentId || !abhaAddress) {
      throw new Error('Consent notification missing consentId or patient id');
    }

    const artefact = await this.prisma.consentArtefact.upsert({
      where: { consentId },
      create: {
        consentId,
        tenantId: scope.tenantId,
        facilityId: scope.facilityId ?? null,
        abhaAddress,
        status,
        hiTypes: (detail?.hiTypes ?? []) as never,
        fromDate: detail?.permission?.dateRange?.from
          ? new Date(detail.permission.dateRange.from)
          : null,
        toDate: detail?.permission?.dateRange?.to ? new Date(detail.permission.dateRange.to) : null,
        expiresAt: detail?.permission?.dataEraseAt ? new Date(detail.permission.dataEraseAt) : null,
        artefact: (parsed?.notification ?? {}) as never,
      },
      // Revocation/expiry updates status; the original artefact is retained.
      update: { status },
    });
    this.logger.log(`Consent ${consentId} ${status} for ${abhaAddress} (tenant ${scope.tenantId})`);

    await this.surfaceToCore(scope, {
      consentId,
      abhaAddress,
      status,
      purpose: detail?.purpose?.text ?? detail?.purpose?.code ?? 'ABDM health information exchange',
      hiTypes: detail?.hiTypes ?? [],
      fromDate: artefact.fromDate?.toISOString(),
      toDate: artefact.toDate?.toISOString(),
      expiresAt: artefact.expiresAt?.toISOString(),
    });

    await this.acknowledge(scope, parsed?.requestId, consentId);
  }

  async list(tenantId: string, abhaAddress?: string) {
    return this.prisma.consentArtefact.findMany({
      where: { tenantId, ...(abhaAddress ? { abhaAddress } : {}) },
      orderBy: { receivedAt: 'desc' },
      take: 200,
    });
  }

  /**
   * Creates/updates the generic PatientConsent in clinical. Failure is
   * recorded on the artefact (surfaced=false + error) rather than failing the
   * callback — the artefact itself is already safely stored.
   */
  private async surfaceToCore(
    scope: AbdmScope,
    consent: {
      consentId: string;
      abhaAddress: string;
      status: string;
      purpose: string;
      hiTypes: string[];
      fromDate?: string | undefined;
      toDate?: string | undefined;
      expiresAt?: string | undefined;
    },
  ): Promise<void> {
    const baseUrl = (process.env.CLINICAL_BASE_URL || 'http://localhost:3011').replace(/\/$/, '');
    const apiKey = process.env.INTERNAL_API_KEY;
    try {
      if (!apiKey) throw new Error('INTERNAL_API_KEY not configured');
      const response = await fetch(`${baseUrl}/api/v1/internal/national-identity/abdm-consents`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-internal-api-key': apiKey,
          'x-service-name': 'abdm-connector',
          'x-tenant-id': scope.tenantId,
        },
        body: JSON.stringify({ tenantId: scope.tenantId, ...consent }),
      });
      if (!response.ok) {
        throw new Error(`clinical answered HTTP ${response.status}`);
      }
      await this.prisma.consentArtefact.update({
        where: { consentId: consent.consentId },
        data: { surfaced: true, surfaceError: null },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.prisma.consentArtefact.update({
        where: { consentId: consent.consentId },
        data: { surfaced: false, surfaceError: message.slice(0, 500) },
      });
      this.logger.warn(`Consent ${consent.consentId} stored but not surfaced to core: ${message}`);
    }
  }

  /** Best-effort gateway acknowledgment (live path only). */
  private async acknowledge(
    scope: AbdmScope,
    requestId: string | undefined,
    consentId: string,
  ): Promise<void> {
    const creds = await this.credentials.getCredentials(scope);
    if (!creds || !requestId) return;
    try {
      const settings = await this.settings.getSettings(scope.tenantId);
      const token = await this.session.getAccessToken(
        settings.gatewayUrl,
        creds.clientId,
        creds.clientSecret,
      );
      await axios.post(
        `${settings.gatewayUrl}/api/hiecm/v3/consents/hip/on-notify`,
        {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          acknowledgement: [{ status: 'OK', consentId }],
          resp: { requestId },
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
      // The artefact is stored; a missed ack is retried by the CM, not by us.
      this.logger.warn(`Consent on-notify ack failed for ${consentId}: ${error}`);
    }
  }
}
