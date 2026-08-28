/**
 * HFR/HPR capability providers — thin clients of the abdm-connector's
 * internal registries API (the connector owns credentials and live/mock
 * selection). Mirrors the AbdmConnectorGateway pattern from the clinical
 * service. Registered with the CapabilityRegistryService by the
 * RegistryLinkModule; selected per tenant via capability bindings.
 */

import { Injectable, Logger, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import type {
  CapabilityContext,
  FacilityRegistryProvider,
  PractitionerRegistryProvider,
  RegistryLinkResult,
  RegistryRecord,
  RegistrySearchQuery,
} from '@athma/plugin-sdk';
import { CAPABILITY_KEYS } from '@athma/plugin-sdk';

type Kind = 'facility' | 'practitioner';

async function callConnector<T>(
  logger: Logger,
  kind: Kind,
  action: 'search' | 'link',
  body: Record<string, unknown>,
): Promise<T> {
  const baseUrl = (process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '');
  const apiKey = process.env.INTERNAL_API_KEY;
  if (!apiKey) {
    throw new ServiceUnavailableException('INTERNAL_API_KEY is not configured — cannot reach the abdm-connector');
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/v1/internal/registries/${kind}/${action}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-internal-api-key': apiKey,
        'x-service-name': 'foundation',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    logger.warn(`abdm-connector unreachable for ${kind} ${action}: ${error}`);
    throw new ServiceUnavailableException('National registry is unavailable right now');
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (response.status === 422 && data['code']) {
    throw new UnprocessableEntityException({
      code: data['code'],
      message: data['message'] ?? 'Registry request failed',
    });
  }
  if (!response.ok) {
    logger.warn(`${kind} ${action} failed with HTTP ${response.status}`);
    throw new ServiceUnavailableException('National registry request failed');
  }
  return data as T;
}

@Injectable()
export class HfrFacilityRegistryProvider implements FacilityRegistryProvider {
  readonly capabilityKey = CAPABILITY_KEYS.REGISTRY_FACILITY;
  readonly providerId = 'hfr';
  readonly operations: ReadonlySet<string> = new Set(['search', 'link', 'status']);
  private readonly logger = new Logger(HfrFacilityRegistryProvider.name);

  async search(ctx: CapabilityContext, query: RegistrySearchQuery): Promise<RegistryRecord[]> {
    const data = await callConnector<{ records: RegistryRecord[] }>(this.logger, 'facility', 'search', {
      tenantId: ctx.tenantId,
      ...(ctx.facilityId ? { facilityId: ctx.facilityId } : {}),
      ...(query.name ? { name: query.name } : {}),
      ...(query.registryId ? { registryId: query.registryId } : {}),
      ...(query.filters ? { filters: query.filters } : {}),
    });
    return data.records ?? [];
  }

  async link(
    ctx: CapabilityContext,
    facilityId: string,
    registryId: string,
  ): Promise<RegistryLinkResult> {
    return callConnector<RegistryLinkResult>(this.logger, 'facility', 'link', {
      tenantId: ctx.tenantId,
      facilityId,
      entityId: facilityId,
      registryId,
    });
  }
}

@Injectable()
export class HprPractitionerRegistryProvider implements PractitionerRegistryProvider {
  readonly capabilityKey = CAPABILITY_KEYS.REGISTRY_PRACTITIONER;
  readonly providerId = 'hpr';
  readonly operations: ReadonlySet<string> = new Set(['search', 'link', 'status']);
  private readonly logger = new Logger(HprPractitionerRegistryProvider.name);

  async search(ctx: CapabilityContext, query: RegistrySearchQuery): Promise<RegistryRecord[]> {
    const data = await callConnector<{ records: RegistryRecord[] }>(this.logger, 'practitioner', 'search', {
      tenantId: ctx.tenantId,
      ...(ctx.facilityId ? { facilityId: ctx.facilityId } : {}),
      ...(query.name ? { name: query.name } : {}),
      ...(query.registryId ? { registryId: query.registryId } : {}),
      ...(query.filters ? { filters: query.filters } : {}),
    });
    return data.records ?? [];
  }

  async link(
    ctx: CapabilityContext,
    staffId: string,
    registryId: string,
  ): Promise<RegistryLinkResult> {
    return callConnector<RegistryLinkResult>(this.logger, 'practitioner', 'link', {
      tenantId: ctx.tenantId,
      ...(ctx.facilityId ? { facilityId: ctx.facilityId } : {}),
      entityId: staffId,
      registryId,
    });
  }
}
