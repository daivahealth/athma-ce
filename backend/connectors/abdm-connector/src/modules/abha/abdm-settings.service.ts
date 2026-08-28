/**
 * Per-tenant ABDM endpoint settings, resolved through the Foundation config
 * hierarchy (abdm.environment / base_url / gateway_url / cm_id /
 * consent_version). Credentials deliberately live elsewhere — see
 * AbdmCredentialsService.
 */

import { Injectable } from '@nestjs/common';
import { configClient } from '../../config';

export interface AbdmSettings {
  environment: string;
  baseUrl: string;
  gatewayUrl: string;
  cmId: string;
  consentVersion: string;
}

@Injectable()
export class AbdmSettingsService {
  async getSettings(tenantId: string): Promise<AbdmSettings> {
    const context = { tenantId };
    const [environment, baseUrl, gatewayUrl, cmId, consentVersion] = await Promise.all([
      configClient.get('abdm.environment', context),
      configClient.get('abdm.base_url', context),
      configClient.get('abdm.gateway_url', context),
      configClient.get('abdm.cm_id', context),
      configClient.get('abdm.consent_version', context),
    ]);

    return {
      environment: String(environment ?? 'sandbox'),
      baseUrl: this.trimSlash(String(baseUrl ?? '')),
      gatewayUrl: this.trimSlash(String(gatewayUrl ?? '')),
      cmId: String(cmId ?? 'sbx'),
      consentVersion: String(consentVersion ?? '1.4'),
    };
  }

  private trimSlash(value: string): string {
    return value.endsWith('/') ? value.slice(0, -1) : value;
  }
}
