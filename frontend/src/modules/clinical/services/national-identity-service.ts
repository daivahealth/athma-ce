import { clinicalClient } from '@/lib/api/client';
import type {
  IdentityProviderInfo,
  IdentityValidationResult,
  PatientIdentity,
  StartChallengeInput,
  IdentityChallenge,
  CompleteChallengeInput,
  IdentityVerificationResult,
  CreatePatientIdentityInput,
  UpdatePatientIdentityInput,
  CreateAbhaAddressInput,
} from '../types/national-identity';

export const nationalIdentityService = {
  /** Providers enabled for the current tenant — drives which ID types the UI offers. */
  async listProviders(country?: string): Promise<IdentityProviderInfo[]> {
    const response = await clinicalClient.get('/national-identity/providers', {
      params: country ? { country } : undefined,
    });
    return response.data;
  },

  /** Offline format/checksum validation. */
  async validate(payload: {
    country: string;
    identityType: string;
    value: string;
  }): Promise<IdentityValidationResult> {
    const response = await clinicalClient.post('/national-identity/validate', payload);
    return response.data;
  },

  /** Sends an OTP. `loginId` is sensitive — do not retain it after this call. */
  async startChallenge(payload: StartChallengeInput): Promise<IdentityChallenge> {
    const response = await clinicalClient.post('/national-identity/challenge', payload);
    return response.data;
  },

  async completeChallenge(
    txnId: string,
    payload: CompleteChallengeInput,
  ): Promise<IdentityVerificationResult> {
    const response = await clinicalClient.post(
      `/national-identity/challenge/${txnId}/verify`,
      payload,
    );
    return response.data;
  },

  async listPatientIdentities(patientId: string): Promise<PatientIdentity[]> {
    const response = await clinicalClient.get(`/patients/${patientId}/identities`);
    return response.data;
  },

  async createPatientIdentity(
    patientId: string,
    payload: CreatePatientIdentityInput,
  ): Promise<PatientIdentity> {
    const response = await clinicalClient.post(`/patients/${patientId}/identities`, payload);
    return response.data;
  },

  async updatePatientIdentity(
    patientId: string,
    id: string,
    payload: UpdatePatientIdentityInput,
  ): Promise<PatientIdentity> {
    const response = await clinicalClient.patch(`/patients/${patientId}/identities/${id}`, payload);
    return response.data;
  },

  async deletePatientIdentity(patientId: string, id: string): Promise<{ deleted: boolean }> {
    const response = await clinicalClient.delete(`/patients/${patientId}/identities/${id}`);
    return response.data;
  },

  // ---- ABHA-specific -------------------------------------------------------

  /** Activation health for this tenant/facility: ok | mock | error. */
  async getAbhaHealth(): Promise<{ status: 'ok' | 'mock' | 'error'; gateway: string; detail?: string }> {
    const response = await clinicalClient.get('/national-identity/abha/health');
    return response.data;
  },

  async getAbhaAddressSuggestions(txnId: string): Promise<string[]> {
    const response = await clinicalClient.post('/national-identity/abha/address/suggestions', {
      txnId,
    });
    return response.data.suggestions;
  },

  async createAbhaAddress(
    payload: CreateAbhaAddressInput,
  ): Promise<{ abhaAddress: string; identity: PatientIdentity | null }> {
    const response = await clinicalClient.post('/national-identity/abha/address', payload);
    return response.data;
  },
};
