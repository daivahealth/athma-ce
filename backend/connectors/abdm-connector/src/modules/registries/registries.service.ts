/**
 * HFR (facility) and HPR (practitioner) registry lookups (issues #108/#109).
 *
 * Same split as the ABHA flows: a tenant/facility with stored ABDM
 * credentials talks to the live registry APIs; one without gets a
 * deterministic mock so onboarding flows stay exercisable everywhere.
 *
 * Live calls are coded against the documented HFR/HPR bridge contract and,
 * like the ABHA gateway, expect a reconciliation pass once sandbox
 * credentials are available (base URLs are per-tenant config:
 * abdm.hfr_base_url / abdm.hpr_base_url).
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { AbdmCredentialsService } from '../abha/abdm-credentials.service';
import { AbdmSessionService } from '../abha/abdm-session.service';
import { AbdmSettingsService } from '../abha/abdm-settings.service';
import { AbdmProviderError } from '../abha/abdm-error';
import type { AbdmScope } from '../abha/abdm-types';
import { CorrelationService } from '../correlation/correlation.service';
import { configClient } from '../../config';

export type RegistryKind = 'facility' | 'practitioner';

export interface RegistryRecord {
  registryId: string;
  name: string;
  attributes?: Record<string, string | undefined>;
}

export interface RegistrySearch {
  name?: string | undefined;
  registryId?: string | undefined;
  filters?: Record<string, string> | undefined;
  page?: number | undefined;
}

@Injectable()
export class RegistriesService {
  private readonly logger = new Logger(RegistriesService.name);

  constructor(
    private readonly credentials: AbdmCredentialsService,
    private readonly session: AbdmSessionService,
    private readonly settings: AbdmSettingsService,
    private readonly correlation: CorrelationService,
  ) {}

  async search(
    kind: RegistryKind,
    scope: AbdmScope,
    query: RegistrySearch,
  ): Promise<{ records: RegistryRecord[]; gateway: string }> {
    const creds = await this.credentials.getCredentials(scope);
    if (!creds) {
      return { records: this.mockSearch(kind, query), gateway: 'mock' };
    }
    return { records: await this.liveSearch(kind, scope, query, creds), gateway: 'abdm' };
  }

  /**
   * Verifies the registry id (search by id must find it) and, for facilities,
   * registers the HIP↔facility routing used by callback resolution. Core
   * persists the id on its own record afterwards.
   */
  async link(
    kind: RegistryKind,
    scope: AbdmScope,
    entityId: string,
    registryId: string,
  ): Promise<{ registryId: string; record?: RegistryRecord; gateway: string }> {
    const { records, gateway } = await this.search(kind, scope, { registryId });
    const record = records.find((r) => r.registryId === registryId);
    if (!record) {
      throw new AbdmProviderError(
        kind === 'facility' ? 'HFR_ID_NOT_FOUND' : 'HPR_ID_NOT_FOUND',
        `Registry id '${registryId}' was not found in the ${kind} registry`,
      );
    }

    if (kind === 'facility') {
      // Each facility is its own HIP (HRP model): gateway-initiated callbacks
      // carrying this HFR id must route to this tenant/facility.
      await this.correlation.putHipMapping(registryId, scope.tenantId, entityId);
      this.logger.log(
        `Linked facility ${entityId} to ${registryId} and registered HIP routing (tenant ${scope.tenantId})`,
      );
    }

    return { registryId, record, gateway };
  }

  // ------------------------------------------------------------------ live

  private async liveSearch(
    kind: RegistryKind,
    scope: AbdmScope,
    query: RegistrySearch,
    creds: { clientId: string; clientSecret: string },
  ): Promise<RegistryRecord[]> {
    const settings = await this.settings.getSettings(scope.tenantId);
    const baseUrl = await this.registryBaseUrl(kind, scope.tenantId);
    if (!baseUrl || !settings.gatewayUrl) {
      throw new AbdmProviderError(
        'ABDM_NOT_CONFIGURED',
        `abdm.${kind === 'facility' ? 'hfr' : 'hpr'}_base_url / abdm.gateway_url are not configured for this tenant`,
      );
    }

    const token = await this.session.getAccessToken(
      settings.gatewayUrl,
      creds.clientId,
      creds.clientSecret,
    );

    const path = kind === 'facility' ? '/v1.0/facilities/search' : '/v1.0/practitioners/search';
    try {
      const response = await axios.post(
        `${baseUrl}${path}`,
        {
          ...(query.registryId ? { id: query.registryId } : {}),
          ...(query.name ? { name: query.name } : {}),
          ...(query.filters ?? {}),
          page: query.page ?? 1,
          resultsPerPage: 20,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'REQUEST-ID': crypto.randomUUID(),
            TIMESTAMP: new Date().toISOString(),
          },
          timeout: 30_000,
        },
      );
      return this.normalizeLive(kind, response.data);
    } catch (error) {
      if (error instanceof AbdmProviderError) throw error;
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      this.logger.warn(`${kind} registry search failed status=${status ?? 'network'}`);
      throw new AbdmProviderError(
        kind === 'facility' ? 'HFR_SEARCH_FAILED' : 'HPR_SEARCH_FAILED',
        `Registry search failed${status ? ` (${status})` : ''}`,
        !status || status >= 500,
      );
    }
  }

  private normalizeLive(kind: RegistryKind, data: any): RegistryRecord[] {
    const list: any[] = Array.isArray(data?.facilities)
      ? data.facilities
      : Array.isArray(data?.practitioners)
        ? data.practitioners
        : Array.isArray(data?.results)
          ? data.results
          : [];
    return list.map((item) => ({
      registryId: String(item.facilityId ?? item.hprId ?? item.id ?? ''),
      name: String(item.facilityName ?? item.name ?? ''),
      attributes: {
        ...(item.state ? { state: String(item.state) } : {}),
        ...(item.district ? { district: String(item.district) } : {}),
        ...(item.address ? { address: String(item.address) } : {}),
        ...(item.systemOfMedicine ? { systemOfMedicine: String(item.systemOfMedicine) } : {}),
      },
    }));
  }

  private async registryBaseUrl(kind: RegistryKind, tenantId: string): Promise<string> {
    const key = kind === 'facility' ? 'abdm.hfr_base_url' : 'abdm.hpr_base_url';
    const raw = await configClient.get(key, { tenantId });
    const url = String(raw ?? '');
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  // ------------------------------------------------------------------ mock

  /** Deterministic offline results so onboarding flows are demo/CI-able. */
  private mockSearch(kind: RegistryKind, query: RegistrySearch): RegistryRecord[] {
    const prefix = kind === 'facility' ? 'IN01' : 'HP';
    if (query.registryId) {
      // Any well-formed id "exists" in the mock so link flows can be exercised.
      if (!/^[A-Za-z0-9-]{4,30}$/.test(query.registryId)) return [];
      return [
        {
          registryId: query.registryId,
          name: `Mock ${kind === 'facility' ? 'Facility' : 'Practitioner'} ${query.registryId.slice(-4)}`,
          attributes: { state: 'Karnataka', district: 'Bengaluru Urban' },
        },
      ];
    }
    const seed = (query.name ?? 'sample').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'sample';
    return [1, 2, 3].map((n) => ({
      registryId: `${prefix}${seed.toUpperCase().slice(0, 4)}${1000 + n}`,
      name: `${(query.name ?? 'Sample').trim()} ${kind === 'facility' ? 'Hospital' : 'Practitioner'} ${n}`,
      attributes: { state: 'Karnataka', district: 'Bengaluru Urban' },
    }));
  }
}
