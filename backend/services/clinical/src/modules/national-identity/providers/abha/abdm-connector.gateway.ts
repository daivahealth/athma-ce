/**
 * Thin client for the abdm-connector's internal ABHA API (issue #97).
 *
 * The clinical service no longer holds ABDM credentials, sessions, or crypto —
 * the connector owns the gateway edge and selects live vs mock per
 * tenant/facility. Errors come back as 422 {code, message, retryable} and are
 * re-raised as IdentityProviderError, so nothing above this seam changed.
 *
 * Sensitive values (Aadhaar, OTP) transit request bodies on the internal
 * network between clinical and the connector; they are never logged and never
 * appear in URLs.
 */

import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { IdentityProviderError } from '../national-identity-provider.interface';
import { AbdmGateway, AbdmScope, AbhaOtpChallenge, AbhaProfile } from './abdm-gateway.interface';

@Injectable()
export class AbdmConnectorGateway implements AbdmGateway {
  readonly name = 'abdm-connector';
  private readonly logger = new Logger(AbdmConnectorGateway.name);
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: `${(process.env.ABDM_CONNECTOR_URL || 'http://localhost:3016').replace(/\/$/, '')}/api/v1`,
      timeout: 45_000,
    });
  }

  async requestEnrolOtp(scope: AbdmScope, aadhaar: string): Promise<AbhaOtpChallenge> {
    return this.post('/internal/abha/enrol/request-otp', { ...this.body(scope), aadhaar });
  }

  async enrolByAadhaar(
    scope: AbdmScope,
    txnId: string,
    otp: string,
    mobile?: string,
  ): Promise<AbhaProfile> {
    return this.post('/internal/abha/enrol/verify', {
      ...this.body(scope),
      txnId,
      otp,
      ...(mobile ? { mobile } : {}),
    });
  }

  async requestLoginOtp(
    scope: AbdmScope,
    loginHint: string,
    loginId: string,
  ): Promise<AbhaOtpChallenge> {
    return this.post('/internal/abha/login/request-otp', {
      ...this.body(scope),
      loginHint,
      loginId,
    });
  }

  async verifyLogin(scope: AbdmScope, txnId: string, otp: string): Promise<AbhaProfile> {
    return this.post('/internal/abha/login/verify', { ...this.body(scope), txnId, otp });
  }

  async getAbhaAddressSuggestions(scope: AbdmScope, txnId: string): Promise<string[]> {
    const data = await this.post<{ suggestions?: string[] }>('/internal/abha/address/suggestions', {
      ...this.body(scope),
      txnId,
    });
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  }

  async createAbhaAddress(scope: AbdmScope, txnId: string, abhaAddress: string): Promise<string> {
    const data = await this.post<{ abhaAddress?: string }>('/internal/abha/address', {
      ...this.body(scope),
      txnId,
      abhaAddress,
    });
    return String(data.abhaAddress ?? abhaAddress);
  }

  /** Which gateway ('abdm' | 'mock') the connector resolves for this scope. */
  async gatewayName(scope: AbdmScope): Promise<string> {
    try {
      const response = await this.http.get('/internal/abha/gateway', {
        params: this.body(scope),
        headers: this.headers(),
      });
      return String(response.data?.gateway ?? 'unknown');
    } catch (error) {
      this.logger.warn(`Could not resolve gateway name from abdm-connector: ${error}`);
      return 'unavailable';
    }
  }

  /** Activation health check, proxied to the connector. */
  async healthCheck(scope: AbdmScope): Promise<{
    status: 'ok' | 'mock' | 'error';
    gateway: string;
    detail?: string;
  }> {
    try {
      const response = await this.http.get('/internal/abha/health', {
        params: this.body(scope),
        headers: this.headers(),
      });
      return response.data;
    } catch (error) {
      return {
        status: 'error',
        gateway: this.name,
        detail: `abdm-connector unreachable: ${error instanceof Error ? error.message : error}`,
      };
    }
  }

  private body(scope: AbdmScope): Record<string, string> {
    return {
      tenantId: scope.tenantId,
      ...(scope.facilityId ? { facilityId: scope.facilityId } : {}),
    };
  }

  private headers(): Record<string, string> {
    const apiKey = process.env.INTERNAL_API_KEY;
    if (!apiKey) {
      throw new IdentityProviderError(
        'ABDM_NOT_CONFIGURED',
        'INTERNAL_API_KEY is not configured — cannot reach the abdm-connector',
      );
    }
    return { 'x-internal-api-key': apiKey, 'x-service-name': 'clinical' };
  }

  private async post<T = AbhaProfile & AbhaOtpChallenge>(path: string, body: unknown): Promise<T> {
    try {
      const response = await this.http.post(path, body, { headers: this.headers() });
      return response.data as T;
    } catch (error) {
      throw this.toProviderError(error);
    }
  }

  /** 422 bodies carry the connector's {code, message, retryable} verbatim. */
  private toProviderError(error: unknown): IdentityProviderError {
    if (error instanceof IdentityProviderError) return error;
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      const data = axiosError.response?.data;
      if (axiosError.response?.status === 422 && data?.code) {
        return new IdentityProviderError(
          String(data.code),
          String(data.message ?? 'ABDM request failed'),
          data.retryable === true,
        );
      }
      const status = axiosError.response?.status;
      this.logger.warn(`abdm-connector call failed status=${status ?? 'network'}`);
      return new IdentityProviderError(
        'ABDM_CONNECTOR_UNAVAILABLE',
        `ABDM connector request failed${status ? ` (${status})` : ''}`,
        !status || status >= 500,
      );
    }
    return new IdentityProviderError(
      'ABDM_CONNECTOR_UNAVAILABLE',
      error instanceof Error ? error.message : 'Unknown connector error',
      true,
    );
  }
}
