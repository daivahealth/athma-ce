/**
 * HIE Provider Abstraction
 *
 * Region-agnostic contract for fetching external patient records from a
 * Health Information Exchange. Concrete networks (e.g. India ABDM, UAE
 * NABIDH/Malaffi/Riayati) are implemented as separate providers behind this
 * interface and selected via configuration. See ADR-0012.
 */

/**
 * Canonical external record categories the platform understands.
 * Providers may emit additional string types; unknown types are ingested
 * verbatim as the document type.
 */
export type ExternalRecordType =
  | 'lab_report'
  | 'discharge_summary'
  | 'imaging'
  | 'prescription'
  | 'immunization'
  | (string & {});

/**
 * A single external clinical record returned by a provider, normalised into a
 * provider-neutral shape before it is ingested as a patient document.
 */
export interface ExternalHealthRecord {
  /** Stable identifier of the record within the source network. */
  externalId: string;
  /** Normalised record category. */
  recordType: ExternalRecordType;
  /** Human-readable title for display. */
  title: string;
  /** Name of the originating system/facility inside the HIE. */
  sourceSystem: string;
  /** Optional URL/pointer to the underlying artefact (PDF, FHIR bundle, ...). */
  documentUrl?: string;
  /** ISO-8601 timestamp of when the record was issued at source. */
  issuedAt?: string;
  /** Free-form provider metadata preserved for audit/traceability. */
  metadata?: Record<string, unknown>;
}

/**
 * A consent-gated request for external records. The concrete provider is
 * responsible for translating {@link patientReference} and
 * {@link consentReference} into whatever the underlying network requires
 * (ABHA address + consent artefact id, Emirates ID + consent token, ...).
 */
export interface HieFetchRequest {
  tenantId: string;
  patientId: string;
  /** External patient identifier in the target network (ABHA / EID / MRN). */
  patientReference?: string;
  /** Record categories to pull; empty/undefined means "all available". */
  recordTypes?: ExternalRecordType[];
  /** Opaque reference to the granted consent used to authorise this fetch. */
  consentReference?: string;
  /**
   * Test/demo affordance: instructs a mock/sandbox provider to simulate a
   * transient failure so the fetch/retry path can be exercised. Real providers
   * ignore this flag.
   */
  simulateFailure?: boolean;
}

export interface HieFetchResponse {
  /** Provider name that served the request. */
  provider: string;
  records: ExternalHealthRecord[];
}

/**
 * Error thrown by providers for a recoverable/transient fetch failure. The HIE
 * service maps this onto a retryable job state.
 */
export class HieProviderError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly retryable = true,
  ) {
    super(message);
    this.name = 'HieProviderError';
  }
}

/**
 * The seam a concrete HIE network integration must implement. Registered under
 * the {@link HIE_PROVIDER} DI token so implementations can be swapped by config
 * without touching the service or controller.
 */
export interface HieProvider {
  /** Stable provider identifier, persisted on fetch jobs (e.g. "mock"). */
  readonly name: string;
  /** Consent-gated fetch of external records for a patient. */
  fetchRecords(request: HieFetchRequest): Promise<HieFetchResponse>;
}

/** Nest DI token for the active {@link HieProvider}. */
export const HIE_PROVIDER = Symbol('HIE_PROVIDER');
