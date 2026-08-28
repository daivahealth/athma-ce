/**
 * Capability registry (ADR-0015 §2/§5).
 *
 * Core modules depend on capability KEYS, never on countries or vendors.
 * Providers (shipped by plugins/connectors) register themselves here at boot;
 * which provider serves a capability for a tenant is ordinary configuration —
 * `capability.<key>.provider` resolved through the instance → tenant →
 * facility hierarchy. An unbound capability is a normal, typed outcome the
 * caller must handle: the generic tenant with no national integrations is the
 * permanent proof the core works with nothing bound.
 *
 * Grandfathered exception: `national.identity` keeps its shipped binding key
 * `identity.enabled_providers` (an ordered, additive list of COUNTRY:type
 * entries) — same semantics, earlier name. New capabilities use the uniform
 * `capability.*` scheme.
 */

import { Injectable, Logger } from '@nestjs/common';

export const CAPABILITY_KEYS = {
  /** National patient identity (ABHA, NHS number, …). Multi-provider; bound via identity.enabled_providers. */
  NATIONAL_IDENTITY: 'national.identity',
  /** National health information exchange (HIP/HIU, GP Connect, …). */
  NATIONAL_EXCHANGE: 'national.exchange',
  /** National facility registry (HFR, ODS, …). */
  REGISTRY_FACILITY: 'registry.facility',
  /** National practitioner registry (HPR, SDS, …). */
  REGISTRY_PRACTITIONER: 'registry.practitioner',
  /** External consent infrastructure (ABDM HIE-CM, national opt-outs, …). */
  CONSENT_EXTERNAL: 'consent.external',
  /** Claims/insurance exchange (NHCX, …). */
  CLAIMS_EXCHANGE: 'claims.exchange',
} as const;

export type CapabilityKey = (typeof CAPABILITY_KEYS)[keyof typeof CAPABILITY_KEYS];

export interface CapabilityContext {
  tenantId: string;
  facilityId?: string | undefined;
}

export interface CapabilityHealth {
  status: 'ok' | 'mock' | 'error';
  detail?: string | undefined;
}

/** Every capability implementation self-describes, mirroring the shipped identity pattern. */
export interface CapabilityProvider {
  readonly capabilityKey: string;
  /** Stable id used in bindings and manifests, e.g. 'hfr', 'abdm', 'nhs-pds'. */
  readonly providerId: string;
  /** Capability-specific verbs this implementation supports. Callers must check. */
  readonly operations: ReadonlySet<string>;
  /** Gate for activation flows; optional for providers with nothing to check. */
  healthCheck?(ctx: CapabilityContext): Promise<CapabilityHealth>;
}

export type CapabilityResolution<T extends CapabilityProvider = CapabilityProvider> =
  | { bound: true; provider: T }
  | { bound: false; reason: 'no_binding' | 'provider_not_registered'; requested?: string };

/** Minimal view of ConfigClient so the SDK doesn't pin its full surface. */
export interface CapabilityConfigSource {
  get(key: string, context: { tenantId?: string; facilityId?: string }): Promise<unknown>;
}

@Injectable()
export class CapabilityRegistryService {
  private readonly logger = new Logger(CapabilityRegistryService.name);
  /** capabilityKey → providerId → provider */
  private readonly providers = new Map<string, Map<string, CapabilityProvider>>();

  constructor(private readonly config: CapabilityConfigSource) {}

  register(provider: CapabilityProvider): void {
    let byId = this.providers.get(provider.capabilityKey);
    if (!byId) {
      byId = new Map();
      this.providers.set(provider.capabilityKey, byId);
    }
    if (byId.has(provider.providerId)) {
      this.logger.warn(
        `Provider '${provider.providerId}' re-registered for '${provider.capabilityKey}' — replacing`,
      );
    }
    byId.set(provider.providerId, provider);
    this.logger.log(`Registered ${provider.capabilityKey} provider '${provider.providerId}'`);
  }

  /** Registered providers for a capability, regardless of tenant binding. */
  providersFor(capabilityKey: string): CapabilityProvider[] {
    return Array.from(this.providers.get(capabilityKey)?.values() ?? []);
  }

  /**
   * Resolves the provider bound to this capability for the caller's tenant
   * (config key `capability.<key>.provider`). Never throws for "not
   * configured" — absence is a normal outcome the caller handles.
   */
  async resolve<T extends CapabilityProvider = CapabilityProvider>(
    capabilityKey: string,
    ctx: CapabilityContext,
  ): Promise<CapabilityResolution<T>> {
    let binding: string | undefined;
    try {
      const raw = await this.config.get(`capability.${capabilityKey}.provider`, {
        tenantId: ctx.tenantId,
        ...(ctx.facilityId ? { facilityId: ctx.facilityId } : {}),
      });
      binding = typeof raw === 'string' && raw.trim() ? raw.trim() : undefined;
    } catch (error) {
      // Config lookup failure counts as unbound rather than crashing the
      // caller's request path; the caller's degraded behavior applies.
      this.logger.warn(`Capability binding lookup failed for '${capabilityKey}': ${error}`);
    }

    if (!binding) return { bound: false, reason: 'no_binding' };

    const provider = this.providers.get(capabilityKey)?.get(binding);
    if (!provider) {
      this.logger.warn(
        `Tenant ${ctx.tenantId} binds '${capabilityKey}' to '${binding}' but no such provider is registered`,
      );
      return { bound: false, reason: 'provider_not_registered', requested: binding };
    }
    return { bound: true, provider: provider as T };
  }
}
