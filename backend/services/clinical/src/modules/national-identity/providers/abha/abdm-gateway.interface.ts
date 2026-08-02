/**
 * The ABDM transport seam.
 *
 * `AbhaProvider` holds the identity semantics; this interface holds the wire
 * calls. Splitting them is what allows a fully-exercisable mock when no NHA
 * credentials are present, without the provider (or anything above it) knowing.
 */

export interface AbhaOtpChallenge {
  txnId: string;
  /** Safe-to-display masked destination, e.g. 'XXXXXXX123'. */
  maskedTarget?: string;
  message?: string;
}

// `| undefined` is spelled out on every optional field because the repo
// compiles with exactOptionalPropertyTypes: gateways build these objects by
// direct assignment, which is only legal when the type admits undefined.
export interface AbhaProfile {
  abhaNumber: string;
  abhaAddress?: string | undefined;
  firstName?: string | undefined;
  middleName?: string | undefined;
  lastName?: string | undefined;
  fullName?: string | undefined;
  dateOfBirth?: string | undefined;
  gender?: string | undefined;
  maskedMobile?: string | undefined;
  /** Short-lived user token (ABDM `X-token`). Never persisted. */
  userToken?: string | undefined;
  /** True when ABDM reported the account as newly created. */
  isNew?: boolean | undefined;
}

export interface AbdmGateway {
  /** 'abdm' for the live gateway, 'mock' for the offline stand-in. */
  readonly name: string;

  /** Step 1 of enrolment — sends an OTP to the Aadhaar-linked mobile. */
  requestEnrolOtp(tenantId: string, aadhaar: string): Promise<AbhaOtpChallenge>;

  /** Step 2 of enrolment — creates the ABHA. */
  enrolByAadhaar(
    tenantId: string,
    txnId: string,
    otp: string,
    mobile?: string,
  ): Promise<AbhaProfile>;

  /** Step 1 of verifying an existing ABHA. */
  requestLoginOtp(tenantId: string, loginHint: string, loginId: string): Promise<AbhaOtpChallenge>;

  /** Step 2 of verifying an existing ABHA. */
  verifyLogin(tenantId: string, txnId: string, otp: string): Promise<AbhaProfile>;

  /** Candidate ABHA addresses for a freshly enrolled account. */
  getAbhaAddressSuggestions(tenantId: string, txnId: string): Promise<string[]>;

  /** Claims an ABHA address for a freshly enrolled account. */
  createAbhaAddress(tenantId: string, txnId: string, abhaAddress: string): Promise<string>;
}

/** Nest DI token for the active {@link AbdmGateway}. */
export const ABDM_GATEWAY = Symbol('ABDM_GATEWAY');
