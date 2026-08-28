/**
 * HIP care-context linking (issue #114, ABDM M2 groundwork).
 *
 * When an encounter closes for an ABHA-linked patient, the encounter becomes
 * a care context under the patient's ABHA address:
 *  - mock path (no tenant credentials): linked immediately, so the whole M2
 *    journey is demo/CI-able;
 *  - live path: the NHA v3 link API is asynchronous — the request registers a
 *    correlation and the care context stays 'pending' until the gateway's
 *    on-link callback confirms it (CallbackService completes it).
 *
 * Live calls are coded against the documented v3 contract with the usual
 * reconciliation caveat until sandbox credentials exist.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AbdmCredentialsService } from '../abha/abdm-credentials.service';
import { AbdmSessionService } from '../abha/abdm-session.service';
import { AbdmSettingsService } from '../abha/abdm-settings.service';
import { CorrelationService } from '../correlation/correlation.service';
import type { AbdmScope } from '../abha/abdm-types';

export interface CareContextInput {
  scope: AbdmScope;
  patientId: string;
  abhaAddress: string;
  careContextRef: string;
  display: string;
}

@Injectable()
export class CareContextService {
  private readonly logger = new Logger(CareContextService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly credentials: AbdmCredentialsService,
    private readonly session: AbdmSessionService,
    private readonly settings: AbdmSettingsService,
    private readonly correlation: CorrelationService,
  ) {}

  /** Idempotent by (tenantId, careContextRef). */
  async linkEncounter(input: CareContextInput): Promise<void> {
    const existing = await this.prisma.careContext.findUnique({
      where: {
        tenantId_careContextRef: {
          tenantId: input.scope.tenantId,
          careContextRef: input.careContextRef,
        },
      },
    });
    if (existing) {
      this.logger.debug(`Care context for encounter ${input.careContextRef} already ${existing.status}`);
      return;
    }

    const creds = await this.credentials.getCredentials(input.scope);
    if (!creds) {
      await this.prisma.careContext.create({
        data: {
          tenantId: input.scope.tenantId,
          facilityId: input.scope.facilityId ?? null,
          patientId: input.patientId,
          abhaAddress: input.abhaAddress,
          careContextRef: input.careContextRef,
          display: input.display,
          gateway: 'mock',
          status: 'linked',
          linkedAt: new Date(),
        },
      });
      this.logger.log(
        `Care context linked (mock) for encounter ${input.careContextRef} under ${input.abhaAddress}`,
      );
      return;
    }

    // Live path: async — record pending + correlation, fire the link request.
    const txnId = crypto.randomUUID();
    await this.prisma.careContext.create({
      data: {
        tenantId: input.scope.tenantId,
        facilityId: input.scope.facilityId ?? null,
        patientId: input.patientId,
        abhaAddress: input.abhaAddress,
        careContextRef: input.careContextRef,
        display: input.display,
        gateway: 'abdm',
        status: 'pending',
        linkTxnId: txnId,
      },
    });
    await this.correlation.register({
      txnId,
      flow: 'link.care-context',
      tenantId: input.scope.tenantId,
      facilityId: input.scope.facilityId,
      ttlSeconds: 24 * 60 * 60,
    });

    try {
      const settings = await this.settings.getSettings(input.scope.tenantId);
      const token = await this.session.getAccessToken(
        settings.gatewayUrl,
        creds.clientId,
        creds.clientSecret,
      );
      const hipId = await this.hipIdFor(input.scope);
      await axios.post(
        `${settings.gatewayUrl}/api/hiecm/v3/link/carecontext`,
        {
          requestId: txnId,
          timestamp: new Date().toISOString(),
          abhaAddress: input.abhaAddress,
          patient: [
            {
              referenceNumber: input.patientId,
              display: input.display,
              careContexts: [{ referenceNumber: input.careContextRef, display: input.display }],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'REQUEST-ID': txnId,
            TIMESTAMP: new Date().toISOString(),
            'X-CM-ID': settings.cmId,
            ...(hipId ? { 'X-HIP-ID': hipId } : {}),
          },
          timeout: 30_000,
        },
      );
      this.logger.log(
        `Care-context link requested (txn ${txnId}) for encounter ${input.careContextRef} — awaiting gateway callback`,
      );
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      await this.prisma.careContext.update({
        where: {
          tenantId_careContextRef: {
            tenantId: input.scope.tenantId,
            careContextRef: input.careContextRef,
          },
        },
        data: { status: 'failed', error: `link request failed${status ? ` (${status})` : ''}` },
      });
      throw error;
    }
  }

  /** Called by the callback path when the gateway confirms a link txn. */
  async completeLink(txnId: string, ok: boolean, detail?: string): Promise<boolean> {
    const context = await this.prisma.careContext.findFirst({ where: { linkTxnId: txnId } });
    if (!context) return false;
    await this.prisma.careContext.update({
      where: { id: context.id },
      data: ok
        ? { status: 'linked', linkedAt: new Date(), error: null }
        : { status: 'failed', error: detail ?? 'gateway reported failure' },
    });
    this.logger.log(`Care context ${context.careContextRef} ${ok ? 'LINKED' : 'FAILED'} (txn ${txnId})`);
    return true;
  }

  async list(tenantId: string, patientId?: string) {
    return this.prisma.careContext.findMany({
      where: { tenantId, ...(patientId ? { patientId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  /** The facility's HFR id doubles as its HIP id (HRP model). */
  private async hipIdFor(scope: AbdmScope): Promise<string | undefined> {
    if (!scope.facilityId) return undefined;
    const mapping = await this.prisma.hipFacilityMapping.findFirst({
      where: { tenantId: scope.tenantId, facilityId: scope.facilityId },
    });
    return mapping?.hipId;
  }
}
