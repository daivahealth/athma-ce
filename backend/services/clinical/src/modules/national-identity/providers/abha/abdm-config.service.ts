/**
 * Resolves ABDM settings for a tenant.
 *
 * Two independent switches, deliberately kept apart:
 *
 *  - `abdm.enabled` (per-tenant Foundation config) decides whether ABHA is
 *    *offered* to that tenant at all. This is the feature flag.
 *  - `ABDM_CLIENT_ID` / `ABDM_CLIENT_SECRET` (service env) decide whether we
 *    can talk to the *real* NHA gateway. Credentials are a deployment concern,
 *    not a tenant preference — and there is no encrypted per-tenant secret
 *    store yet (see issue #81).
 *
 * With the flag on but no credentials present, the mock gateway is used so the
 * whole flow stays exercisable in dev/sandbox-less environments.
 */

import { Injectable, Logger } from '@nestjs/common';
import { configClient } from '../../../../config';

export interface AbdmSettings {
  enabled: boolean;
  environment: string;
  baseUrl: string;
  gatewayUrl: string;
  cmId: string;
  consentVersion: string;
}

@Injectable()
export class AbdmConfigService {
  private readonly logger = new Logger(AbdmConfigService.name);

  /** True when real NHA credentials are present in the environment. */
  get hasCredentials(): boolean {
    return Boolean(process.env['ABDM_CLIENT_ID'] && process.env['ABDM_CLIENT_SECRET']);
  }

  get clientId(): string {
    return process.env['ABDM_CLIENT_ID'] ?? '';
  }

  get clientSecret(): string {
    return process.env['ABDM_CLIENT_SECRET'] ?? '';
  }

  async getSettings(tenantId: string): Promise<AbdmSettings> {
    const context = { tenantId };

    const [enabled, environment, baseUrl, gatewayUrl, cmId, consentVersion] = await Promise.all([
      configClient.get('abdm.enabled', context),
      configClient.get('abdm.environment', context),
      configClient.get('abdm.base_url', context),
      configClient.get('abdm.gateway_url', context),
      configClient.get('abdm.cm_id', context),
      configClient.get('abdm.consent_version', context),
    ]);

    return {
      enabled: enabled === true || String(enabled) === 'true',
      environment: String(environment ?? 'sandbox'),
      baseUrl: this.trimSlash(String(baseUrl ?? '')),
      gatewayUrl: this.trimSlash(String(gatewayUrl ?? '')),
      cmId: String(cmId ?? 'sbx'),
      consentVersion: String(consentVersion ?? '1.4'),
    };
  }

  /** Providers a tenant has switched on, as `COUNTRY:type` strings. */
  async getEnabledProviderKeys(tenantId: string): Promise<string[]> {
    const raw = await configClient.get('identity.enabled_providers', { tenantId });

    if (Array.isArray(raw)) {
      return raw.map((k) => String(k).toUpperCase());
    }

    // Tolerate a JSON-encoded string, which is how config values round-trip
    // through the instance_configs table.
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((k) => String(k).toUpperCase());
      } catch {
        this.logger.warn(`identity.enabled_providers is not valid JSON for tenant ${tenantId}`);
      }
    }

    return [];
  }

  private trimSlash(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value;
  }
}
