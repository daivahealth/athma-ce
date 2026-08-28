/**
 * SPIs for the registry.facility / registry.practitioner capabilities
 * (ADR-0015): national registries (HFR/HPR in India, ODS/SDS in the UK, …)
 * behind country-neutral contracts. Core stores only the generic
 * externalRegistryId on Facility/Staff; everything registry-specific lives in
 * the provider.
 */

import type { CapabilityContext, CapabilityProvider } from './capability-registry';

export interface RegistryRecord {
  /** The registry's own identifier (HFR id, ODS code, HPR id, …). */
  registryId: string;
  name: string;
  /** Registry-specific display attributes (address, district, systemOfMedicine, …). */
  attributes?: Record<string, string | undefined>;
}

export interface RegistrySearchQuery {
  /** Free-text name search. */
  name?: string | undefined;
  /** Exact registry id lookup. */
  registryId?: string | undefined;
  /** Registry-specific filters (state, district, …). */
  filters?: Record<string, string> | undefined;
  page?: number | undefined;
}

export interface RegistryLinkResult {
  registryId: string;
  /** Canonical record as the registry knows it, for display/confirmation. */
  record?: RegistryRecord | undefined;
}

/** Operations a registry provider may advertise in `operations`. */
export type RegistryOperation = 'search' | 'link' | 'status';

export interface FacilityRegistryProvider extends CapabilityProvider {
  search(ctx: CapabilityContext, query: RegistrySearchQuery): Promise<RegistryRecord[]>;
  /**
   * Verifies the registry id and performs provider-side link effects (for
   * ABDM: registering the HIP↔facility routing used by callback resolution).
   * Core persists the returned registryId on the Facility afterwards.
   */
  link(
    ctx: CapabilityContext,
    facilityId: string,
    registryId: string,
  ): Promise<RegistryLinkResult>;
}

export interface PractitionerRegistryProvider extends CapabilityProvider {
  search(ctx: CapabilityContext, query: RegistrySearchQuery): Promise<RegistryRecord[]>;
  /** Verifies the registry id; core persists it on the Staff record afterwards. */
  link(ctx: CapabilityContext, staffId: string, registryId: string): Promise<RegistryLinkResult>;
}
