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

import { Injectable } from '@nestjs/common';
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
import { AbdmGateway, AbdmScope, AbhaProfile } from './abdm-gateway.interface';
import { AbdmCredentialsService } from './abdm-credentials.service';
import { AbdmHttpGateway } from './abdm-http.gateway';
import { MockAbdmGateway } from './mock-abdm.gateway';

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

  constructor(
    private readonly credentials: AbdmCredentialsService,
    private readonly liveGateway: AbdmHttpGateway,
    private readonly mockGateway: MockAbdmGateway,
  ) {}

  /**
   * Gateway selection is PER REQUEST, per tenant/facility (issue #96): a
   * tenant with stored credentials talks to the live gateway; one without
   * gets the fully-exercisable mock. Sandbox and production tenants coexist
   * in one deployment — nothing is bound at boot any more.
   */
  private async gateway(scope: AbdmScope): Promise<AbdmGateway> {
    return (await this.credentials.hasCredentials(scope)) ? this.liveGateway : this.mockGateway;
  }

  /** Which gateway a tenant would use — surfaced so the UI can badge "mock". */
  async getGatewayName(scope: AbdmScope): Promise<string> {
    return (await this.gateway(scope)).name;
  }

  /**
   * Activation health check (ADR-0015 plugin lifecycle): resolves credentials
   * and, when live, performs a real gateway session handshake so a tenant
   * cannot be switched on with broken credentials.
   */
  async healthCheck(scope: AbdmScope): Promise<{
    status: 'ok' | 'mock' | 'error';
    gateway: string;
    detail?: string;
  }> {
    const creds = await this.credentials.getCredentials(scope);
    if (!creds) {
      return { status: 'mock', gateway: this.mockGateway.name };
    }
    try {
      // A login-OTP request would send a real OTP; the session handshake is
      // the side-effect-free way to prove the credentials work.
      await this.liveGateway.checkSession(scope);
      return { status: 'ok', gateway: this.liveGateway.name };
    } catch (error) {
      return {
        status: 'error',
        gateway: this.liveGateway.name,
        detail: error instanceof Error ? error.message : String(error),
      };
    }
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
      return (await this.gateway(this.scopeOf(req))).requestEnrolOtp(this.scopeOf(req), req.loginId);
    }

    if (!this.loginHints.includes(req.loginHint)) {
      throw new IdentityProviderError(
        'IDENTITY_UNSUPPORTED_HINT',
        `Unsupported login hint '${req.loginHint}' for ABHA`,
      );
    }

    return (await this.gateway(this.scopeOf(req))).requestLoginOtp(this.scopeOf(req), req.loginHint, req.loginId);
  }

  async completeChallenge(req: IdentityChallengeCompletion): Promise<IdentityVerificationResult> {
    if (!req.otp?.trim()) {
      throw new IdentityProviderError('IDENTITY_MISSING_OTP', 'An OTP is required');
    }

    const scope = this.scopeOf(req);
    const gateway = await this.gateway(scope);
    const profile =
      req.purpose === 'enroll'
        ? await gateway.enrolByAadhaar(scope, req.txnId, req.otp, req.mobile)
        : await gateway.verifyLogin(scope, req.txnId, req.otp);

    return this.toResult(profile, req.purpose, gateway.name);
  }

  /** Candidate ABHA addresses for a freshly enrolled account. */
  async getAddressSuggestions(scope: AbdmScope, txnId: string): Promise<string[]> {
    return (await this.gateway(scope)).getAbhaAddressSuggestions(scope, txnId);
  }

  /** Claims an ABHA address for a freshly enrolled account. */
  async createAddress(scope: AbdmScope, txnId: string, abhaAddress: string): Promise<string> {
    return (await this.gateway(scope)).createAbhaAddress(scope, txnId, abhaAddress);
  }

  private scopeOf(req: { tenantId: string; facilityId?: string | undefined }): AbdmScope {
    return { tenantId: req.tenantId, facilityId: req.facilityId };
  }

  private toResult(
    profile: AbhaProfile,
    purpose: 'verify' | 'enroll',
    gatewayName: string,
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
        gateway: gatewayName,
        isNew: profile.isNew ?? false,
        ...(profile.maskedMobile ? { maskedMobile: profile.maskedMobile } : {}),
      },
    };
  }
}
