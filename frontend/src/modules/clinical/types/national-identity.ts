/**
 * National identity types (ABHA, Emirates ID, passport, …).
 *
 * The UI is driven by whatever `GET /national-identity/providers` returns for
 * the tenant — there is deliberately no hardcoded country logic on the client.
 */

export type IdentityCapability = 'validate' | 'verify' | 'enroll' | 'demographics' | 'card';

export type IdentityVerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'FAILED' | 'EXPIRED';

export type IdentityChallengePurpose = 'verify' | 'enroll';

export interface IdentityProviderInfo {
  country: string;
  identityType: string;
  label: string;
  capabilities: IdentityCapability[];
  /** e.g. ['aadhaar', 'mobile', 'abha-number']; empty for validate-only providers. */
  loginHints: string[];
  /** ABHA only: 'mock' or 'abdm' — lets the UI badge non-production gateways. */
  gateway?: string;
  environment?: string;
}

export interface IdentityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  normalizedValue?: string;
  country: string;
  identityType: string;
}

export interface PatientIdentity {
  id: string;
  tenantId: string;
  patientId: string;
  country: string;
  identityType: string;
  /** Normalized primary value — for ABHA, the 14-digit number. */
  value: string;
  /** For ABHA, the ABHA address (e.g. name@sbx). */
  secondaryValue: string | null;
  verificationStatus: IdentityVerificationStatus;
  verificationMethod: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  isPrimary: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
}

export interface StartChallengeInput {
  country: string;
  identityType: string;
  purpose: IdentityChallengePurpose;
  loginHint: string;
  /** SENSITIVE — the raw Aadhaar/mobile/ABHA number. Never log or persist client-side. */
  loginId: string;
  patientId?: string;
}

export interface IdentityChallenge {
  txnId: string;
  /** Masked destination the OTP was sent to, e.g. 'XXXXXX3210'. */
  maskedTarget?: string;
  message?: string;
  expiresAt?: string;
  country: string;
  identityType: string;
  purpose: IdentityChallengePurpose;
}

export interface CompleteChallengeInput {
  otp: string;
  mobile?: string;
  patientId?: string;
}

export interface IdentityVerificationResult {
  verified: boolean;
  identityValue?: string;
  secondaryValue?: string;
  demographics?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    fullName?: string;
    dateOfBirth?: string;
    gender?: string;
    maskedMobile?: string;
  };
  method?: string;
  /** Carried forward so a new ABHA account can claim an address. */
  txnId: string;
  identity: PatientIdentity | null;
}

export interface CreatePatientIdentityInput {
  country: string;
  identityType: string;
  value: string;
  secondaryValue?: string;
  verificationStatus?: IdentityVerificationStatus;
  verificationMethod?: string;
  isPrimary?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdatePatientIdentityInput {
  isPrimary?: boolean;
  secondaryValue?: string;
  verificationStatus?: IdentityVerificationStatus;
}

export interface CreateAbhaAddressInput {
  txnId: string;
  abhaAddress: string;
  patientId?: string;
}
