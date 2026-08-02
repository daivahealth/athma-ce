/**
 * Live ABDM gateway (NHA v3).
 *
 * Every request carries Authorization / REQUEST-ID / TIMESTAMP / X-CM-ID as
 * required by NHA. Aadhaar, mobile and OTP values are RSA-encrypted before
 * they leave this process, and error handling deliberately never echoes a
 * request body — a failed enrolment must not leak an Aadhaar number into logs.
 *
 * Coded against the documented v3 contract; not yet exercised against live NHA
 * endpoints (no sandbox credentials at time of writing). Expect a
 * reconciliation pass when credentials are available.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import * as crypto from 'crypto';
import { IdentityProviderError } from '../national-identity-provider.interface';
import { AbdmConfigService } from './abdm-config.service';
import { AbdmSessionService } from './abdm-session.service';
import { AbdmCryptoService } from './abdm-crypto.service';
import { AbdmGateway, AbhaOtpChallenge, AbhaProfile } from './abdm-gateway.interface';

@Injectable()
export class AbdmHttpGateway implements AbdmGateway {
  readonly name = 'abdm';
  private readonly logger = new Logger(AbdmHttpGateway.name);

  constructor(
    private readonly config: AbdmConfigService,
    private readonly session: AbdmSessionService,
    private readonly crypto: AbdmCryptoService,
  ) {}

  async requestEnrolOtp(tenantId: string, aadhaar: string): Promise<AbhaOtpChallenge> {
    const { baseUrl, token, headers } = await this.prepare(tenantId);
    const encrypted = await this.crypto.encrypt(baseUrl, token, aadhaar);

    const data = await this.post(
      `${baseUrl}/v3/enrollment/request/otp`,
      {
        txnId: '',
        scope: ['abha-enrol'],
        loginHint: 'aadhaar',
        loginId: encrypted,
        otpSystem: 'aadhaar',
      },
      headers,
      'ABDM_ENROL_OTP_FAILED',
    );

    return {
      txnId: String(data?.txnId ?? ''),
      maskedTarget: data?.message ? undefined : data?.mobileNumber,
      message: data?.message,
    };
  }

  async enrolByAadhaar(
    tenantId: string,
    txnId: string,
    otp: string,
    mobile?: string,
  ): Promise<AbhaProfile> {
    const settings = await this.config.getSettings(tenantId);
    const { baseUrl, token, headers } = await this.prepare(tenantId);

    const encryptedOtp = await this.crypto.encrypt(baseUrl, token, otp);
    const encryptedMobile = mobile ? await this.crypto.encrypt(baseUrl, token, mobile) : undefined;

    const data = await this.post(
      `${baseUrl}/v3/enrollment/enrol/byAadhaar`,
      {
        txnId,
        scope: ['abha-enrol'],
        authData: {
          authMethods: ['otp'],
          otp: {
            txnId,
            otpValue: encryptedOtp,
            ...(encryptedMobile ? { mobile: encryptedMobile } : {}),
          },
        },
        consent: { code: 'abha-enrollment', version: settings.consentVersion },
      },
      headers,
      'ABDM_ENROL_FAILED',
    );

    return this.toProfile(data);
  }

  async requestLoginOtp(
    tenantId: string,
    loginHint: string,
    loginId: string,
  ): Promise<AbhaOtpChallenge> {
    const { baseUrl, token, headers } = await this.prepare(tenantId);
    const encrypted = await this.crypto.encrypt(baseUrl, token, loginId);

    // ABDM routes the OTP through Aadhaar for aadhaar/abha-number hints and
    // through the ABDM mobile system for a mobile hint.
    const otpSystem = loginHint === 'mobile' ? 'abdm' : 'aadhaar';

    const data = await this.post(
      `${baseUrl}/v3/profile/login/request/otp`,
      {
        scope: ['abha-login', loginHint === 'mobile' ? 'mobile-verify' : 'aadhaar-verify'],
        loginHint,
        loginId: encrypted,
        otpSystem,
      },
      headers,
      'ABDM_LOGIN_OTP_FAILED',
    );

    return {
      txnId: String(data?.txnId ?? ''),
      maskedTarget: data?.message,
      message: data?.message,
    };
  }

  async verifyLogin(tenantId: string, txnId: string, otp: string): Promise<AbhaProfile> {
    const { baseUrl, token, headers } = await this.prepare(tenantId);
    const encryptedOtp = await this.crypto.encrypt(baseUrl, token, otp);

    const data = await this.post(
      `${baseUrl}/v3/profile/login/verify`,
      {
        scope: ['abha-login', 'aadhaar-verify'],
        authData: {
          authMethods: ['otp'],
          otp: { txnId, otpValue: encryptedOtp },
        },
      },
      headers,
      'ABDM_LOGIN_VERIFY_FAILED',
    );

    return this.toProfile(data);
  }

  async getAbhaAddressSuggestions(tenantId: string, txnId: string): Promise<string[]> {
    const { baseUrl, headers } = await this.prepare(tenantId);

    try {
      const response = await axios.get(`${baseUrl}/v3/enrollment/enrol/suggestion`, {
        headers: { ...headers, 'TRANSACTION_ID': txnId },
        timeout: 20_000,
      });
      const list: unknown = response.data?.abhaAddressList;
      return Array.isArray(list) ? list.map(String) : [];
    } catch (error) {
      throw this.toProviderError(error, 'ABDM_SUGGESTION_FAILED');
    }
  }

  async createAbhaAddress(tenantId: string, txnId: string, abhaAddress: string): Promise<string> {
    const { baseUrl, headers } = await this.prepare(tenantId);

    const data = await this.post(
      `${baseUrl}/v3/enrollment/enrol/abha-address`,
      { txnId, abhaAddress, preferred: 1 },
      headers,
      'ABDM_ADDRESS_FAILED',
    );

    return String(data?.preferredAbhaAddress ?? data?.abhaAddress ?? abhaAddress);
  }

  // ---------------------------------------------------------------- internals

  private async prepare(tenantId: string): Promise<{
    baseUrl: string;
    token: string;
    headers: Record<string, string>;
  }> {
    const settings = await this.config.getSettings(tenantId);

    if (!settings.baseUrl || !settings.gatewayUrl) {
      throw new IdentityProviderError(
        'ABDM_NOT_CONFIGURED',
        'ABDM base_url/gateway_url are not configured for this tenant',
      );
    }

    const token = await this.session.getAccessToken(
      settings.gatewayUrl,
      this.config.clientId,
      this.config.clientSecret,
    );

    return {
      baseUrl: settings.baseUrl,
      token,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'REQUEST-ID': crypto.randomUUID(),
        TIMESTAMP: new Date().toISOString(),
        'X-CM-ID': settings.cmId,
      },
    };
  }

  private async post(
    url: string,
    body: unknown,
    headers: Record<string, string>,
    errorCode: string,
  ): Promise<any> {
    const config: AxiosRequestConfig = { headers, timeout: 30_000 };
    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      throw this.toProviderError(error, errorCode);
    }
  }

  /**
   * Maps an axios failure onto an IdentityProviderError. Only the upstream
   * status and ABDM's own message are surfaced — the request body (which may
   * hold an encrypted Aadhaar or OTP) is never included.
   */
  private toProviderError(error: unknown, code: string): IdentityProviderError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const status = axiosError.response?.status;
      const upstream =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error?.message ??
        axiosError.message;

      // 5xx and timeouts are worth retrying; 4xx means the input was wrong.
      const retryable = !status || status >= 500;
      this.logger.warn(`ABDM call failed [${code}] status=${status ?? 'network'}`);

      return new IdentityProviderError(
        code,
        `ABDM request failed${status ? ` (${status})` : ''}: ${upstream}`,
        retryable,
      );
    }

    return new IdentityProviderError(
      code,
      error instanceof Error ? error.message : 'Unknown ABDM error',
    );
  }

  private toProfile(data: any): AbhaProfile {
    const profile = data?.ABHAProfile ?? data?.abhaProfile ?? data ?? {};
    const abhaNumber = String(profile.ABHANumber ?? profile.abhaNumber ?? '').replace(/\D/g, '');

    return {
      abhaNumber,
      abhaAddress: profile.phrAddress?.[0] ?? profile.abhaAddress ?? undefined,
      firstName: profile.firstName,
      middleName: profile.middleName,
      lastName: profile.lastName,
      fullName: profile.name,
      dateOfBirth: this.toIsoDate(profile),
      gender: profile.gender,
      maskedMobile: profile.mobile ? this.mask(String(profile.mobile)) : undefined,
      userToken: data?.token ?? data?.tokens?.token ?? undefined,
      isNew: data?.isNew === true || data?.new === true,
    };
  }

  private toIsoDate(profile: any): string | undefined {
    if (profile.dob) return String(profile.dob);
    const { yearOfBirth, monthOfBirth, dayOfBirth } = profile;
    if (yearOfBirth && monthOfBirth && dayOfBirth) {
      return `${yearOfBirth}-${String(monthOfBirth).padStart(2, '0')}-${String(dayOfBirth).padStart(2, '0')}`;
    }
    return undefined;
  }

  private mask(value: string): string {
    const digits = value.replace(/\D/g, '');
    return digits.length <= 4 ? 'XXXX' : `${'X'.repeat(digits.length - 4)}${digits.slice(-4)}`;
  }
}
