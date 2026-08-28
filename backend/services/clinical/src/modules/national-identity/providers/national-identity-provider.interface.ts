/**
 * National Identity Provider Abstraction
 *
 * Country-agnostic contract for national identity documents. Concrete
 * registries (India ABHA/ABDM, UAE Emirates ID, ...) implement this and are
 * selected by configuration — nothing above this seam knows which country it
 * is talking to.
 *
 * Providers differ enormously in what they can do, so capability is explicit
 * rather than assumed:
 *
 *   - Emirates ID  → ['validate']                    (offline checksum only)
 *   - ABHA         → ['validate','verify','enroll','demographics','card']
 *
 * Callers must check `capabilities` before invoking an optional method. That
 * asymmetry is deliberate: it is what lets a validate-only document and a full
 * OTP-backed registry live behind one interface.
 *
 * This is the *identity* axis. Fetching clinical records over a health
 * information exchange is a separate concern served by `HieProvider`
 * (see ADR-0012) — an ABHA is an identity that the HIE axis can later consume
 * as a patient reference, not an HIE provider itself.
 */

import type { ValidationResult } from '@zeal/validators';

export type IdentityCapability =
  /** Offline format/length/checksum validation. Every provider supports this. */
  | 'validate'
  /** Online proof-of-ownership via a challenge (typically OTP). */
  | 'verify'
  /** Create a brand-new identity in the national registry. */
  | 'enroll'
  /** Returns demographics (name/dob/gender) on successful verification. */
  | 'demographics'
  /** Can produce a printable card / QR for the identity. */
  | 'card';

/** Why a challenge is being started — providers use different scopes per purpose. */
export type IdentityChallengePurpose = 'verify' | 'enroll';

export interface IdentityChallengeRequest {
  /** Endpoint configuration (base URLs, CM id, ...) resolves per tenant. */
  tenantId: string;
  /** Credentials may be facility-scoped (e.g. ABDM per-HIP registrations). */
  facilityId?: string | undefined;
  purpose: IdentityChallengePurpose;
  /**
   * Which kind of value `loginId` holds, e.g. 'aadhaar' | 'mobile' |
   * 'abha-number'. Provider-specific; surfaced to the UI via `loginHints`.
   */
  loginHint: string;
  /**
   * The raw identifier the patient supplied. SENSITIVE — the provider is
   * responsible for encrypting it in transit. Never logged, never persisted.
   */
  loginId: string;
}

export interface IdentityChallenge {
  /** Opaque, provider-scoped transaction id. */
  txnId: string;
  /** Masked destination the OTP was sent to, safe to display (e.g. 'XXXXXX1234'). */
  maskedTarget?: string;
  expiresAt?: string;
  /** Provider-specific hint about what to collect next. */
  message?: string;
}

export interface IdentityChallengeCompletion {
  tenantId: string;
  /** Must match the facility scope the challenge was started under. */
  facilityId?: string | undefined;
  txnId: string;
  purpose: IdentityChallengePurpose;
  /** The OTP the patient received. SENSITIVE — never logged or persisted. */
  otp: string;
  /** Optional mobile to attach during enrolment. SENSITIVE. */
  mobile?: string;
}

export interface IdentityDemographics {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  /** Masked only — never a full mobile number. */
  maskedMobile?: string;
}

export interface IdentityVerificationResult {
  verified: boolean;
  /** The resulting identity value, e.g. the 14-digit ABHA number. */
  identityValue?: string;
  /** Companion handle where the registry has one, e.g. the ABHA address. */
  secondaryValue?: string;
  demographics?: IdentityDemographics;
  /** How ownership was proven — persisted as `verificationMethod`. */
  method?: string;
  /**
   * Short-lived, user-scoped token some registries return (ABDM `X-token`).
   * SENSITIVE: held only for the duration of the transaction, never persisted
   * and never returned to the browser.
   */
  providerToken?: string;
  /** Non-sensitive extras safe to persist as identity metadata. */
  metadata?: Record<string, unknown>;
}

/** Recoverable/expected provider failure, mapped to a 4xx by the service. */
export class IdentityProviderError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    /** True when the caller can sensibly retry (transient upstream fault). */
    public readonly retryable = false,
  ) {
    super(message);
    this.name = 'IdentityProviderError';
  }
}

export interface NationalIdentityProvider {
  /** ISO 3166-1 alpha-2 country code, e.g. 'IN', 'AE'. */
  readonly country: string;
  /** Document type, matching the `national_id_type` valueset, e.g. 'abha'. */
  readonly identityType: string;
  /** Human-readable label for the UI. */
  readonly label: string;
  readonly capabilities: ReadonlySet<IdentityCapability>;
  /** Accepted `loginHint` values for `startChallenge` (empty if not verifiable). */
  readonly loginHints: readonly string[];

  /** Offline validation. Always available. */
  validate(value: string): ValidationResult;

  /** Required when `capabilities` includes 'verify' or 'enroll'. */
  startChallenge?(req: IdentityChallengeRequest): Promise<IdentityChallenge>;
  completeChallenge?(req: IdentityChallengeCompletion): Promise<IdentityVerificationResult>;
}

/** Nest DI token collecting every registered provider (multi-provider). */
export const NATIONAL_IDENTITY_PROVIDERS = Symbol('NATIONAL_IDENTITY_PROVIDERS');
