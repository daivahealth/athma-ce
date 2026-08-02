/**
 * ABHA provider (India — NHA / ABDM).
 *
 * Maps the generic NationalIdentityProvider contract onto ABDM's enrolment and
 * login flows. All wire traffic goes through {@link AbdmGateway}, so this class
 * is identical whether it is backed by the live gateway or the offline mock.
 *
 * PRIVACY: the Aadhaar number and OTP passed in here are used to build a single
 * outbound request and are never persisted or logged. Only the resulting ABHA
 * number/address and masked metadata leave this class.
 */

import { Inject, Injectable } from '@nestjs/common';
import { AbhaNumberValidator, type ValidationResult } from '@zeal/validators';
import {
  IdentityCapability,
  IdentityChallenge,
  IdentityChallengeCompletion,
  IdentityChallengeRequest,
  IdentityProviderError,
  IdentityVerificationResult,
  NationalIdentityProvider,
} from '../national-identity-provider.interface';
import { ABDM_GATEWAY, AbdmGateway, AbhaProfile } from './abdm-gateway.interface';

@Injectable()
export class AbhaProvider implements NationalIdentityProvider {
  readonly country = 'IN';
  readonly identityType = 'abha';
  readonly label = 'ABHA (Ayushman Bharat Health Account)';
  readonly capabilities: ReadonlySet<IdentityCapability> = new Set<IdentityCapability>([
    'validate',
    'verify',
    'enroll',
    'demographics',
    'card',
  ]);
  /** `aadhaar` is used for enrolment; all three are valid for verification. */
  readonly loginHints: readonly string[] = ['aadhaar', 'mobile', 'abha-number'];

  private readonly validator = new AbhaNumberValidator();

  constructor(@Inject(ABDM_GATEWAY) private readonly gateway: AbdmGateway) {}

  /** Which gateway is live — surfaced so the UI can badge "mock" in dev. */
  get gatewayName(): string {
    return this.gateway.name;
  }

  validate(value: string): ValidationResult {
    return this.validator.validate(value);
  }

  async startChallenge(req: IdentityChallengeRequest): Promise<IdentityChallenge> {
    if (!req.loginId?.trim()) {
      throw new IdentityProviderError('IDENTITY_MISSING_LOGIN_ID', 'An identifier is required');
    }

    if (req.purpose === 'enroll') {
      // ABDM only supports Aadhaar-backed enrolment on this path; document
      // enrolment (driving licence) is a separate, un-implemented flow.
      if (req.loginHint !== 'aadhaar') {
        throw new IdentityProviderError(
          'IDENTITY_UNSUPPORTED_HINT',
          'Creating an ABHA requires an Aadhaar number',
        );
      }
      return this.gateway.requestEnrolOtp(req.tenantId, req.loginId);
    }

    if (!this.loginHints.includes(req.loginHint)) {
      throw new IdentityProviderError(
        'IDENTITY_UNSUPPORTED_HINT',
        `Unsupported login hint '${req.loginHint}' for ABHA`,
      );
    }

    return this.gateway.requestLoginOtp(req.tenantId, req.loginHint, req.loginId);
  }

  async completeChallenge(req: IdentityChallengeCompletion): Promise<IdentityVerificationResult> {
    if (!req.otp?.trim()) {
      throw new IdentityProviderError('IDENTITY_MISSING_OTP', 'An OTP is required');
    }

    const profile =
      req.purpose === 'enroll'
        ? await this.gateway.enrolByAadhaar(req.tenantId, req.txnId, req.otp, req.mobile)
        : await this.gateway.verifyLogin(req.tenantId, req.txnId, req.otp);

    return this.toResult(profile, req.purpose);
  }

  /** Candidate ABHA addresses for a freshly enrolled account. */
  async getAddressSuggestions(tenantId: string, txnId: string): Promise<string[]> {
    return this.gateway.getAbhaAddressSuggestions(tenantId, txnId);
  }

  /** Claims an ABHA address for a freshly enrolled account. */
  async createAddress(tenantId: string, txnId: string, abhaAddress: string): Promise<string> {
    return this.gateway.createAbhaAddress(tenantId, txnId, abhaAddress);
  }

  private toResult(
    profile: AbhaProfile,
    purpose: 'verify' | 'enroll',
  ): IdentityVerificationResult {
    if (!profile.abhaNumber) {
      throw new IdentityProviderError(
        'ABDM_NO_ABHA_RETURNED',
        'ABDM did not return an ABHA number for this transaction',
      );
    }

    const normalized = this.validator.format(profile.abhaNumber);

    return {
      verified: true,
      identityValue: normalized,
      ...(profile.abhaAddress ? { secondaryValue: profile.abhaAddress } : {}),
      demographics: {
        ...(profile.firstName ? { firstName: profile.firstName } : {}),
        ...(profile.middleName ? { middleName: profile.middleName } : {}),
        ...(profile.lastName ? { lastName: profile.lastName } : {}),
        ...(profile.fullName ? { fullName: profile.fullName } : {}),
        ...(profile.dateOfBirth ? { dateOfBirth: profile.dateOfBirth } : {}),
        ...(profile.gender ? { gender: profile.gender } : {}),
        ...(profile.maskedMobile ? { maskedMobile: profile.maskedMobile } : {}),
      },
      method: purpose === 'enroll' ? 'aadhaar_otp' : 'abdm_otp',
      ...(profile.userToken ? { providerToken: profile.userToken } : {}),
      // Only non-sensitive values — no token, no Aadhaar, no OTP.
      metadata: {
        gateway: this.gateway.name,
        isNew: profile.isNew ?? false,
        ...(profile.maskedMobile ? { maskedMobile: profile.maskedMobile } : {}),
      },
    };
  }
}
