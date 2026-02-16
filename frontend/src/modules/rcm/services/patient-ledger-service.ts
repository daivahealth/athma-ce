import { rcmClient } from '@/lib/api/client';
import type {
  CreateAdjustmentInput,
  CreateOpeningBalanceInput,
  LedgerFilters,
  PatientBalanceSummary,
  PatientLedgerEntry,
  PatientLedgerResponse,
  ReverseEntryInput,
} from '../types/patient-ledger';

class PatientLedgerService {
  async getLedger(patientId: string, filters?: LedgerFilters): Promise<PatientLedgerResponse> {
    const response = await rcmClient.get(`/patients/${patientId}/ledger`, { params: filters });
    return response.data;
  }

  async getBalanceSummary(patientId: string, currency?: string): Promise<PatientBalanceSummary | null> {
    const response = await rcmClient.get(`/patients/${patientId}/ledger/summary`, {
      params: { currency },
    });
    return response.data;
  }

  async getEntry(patientId: string, entryId: string): Promise<PatientLedgerEntry> {
    const response = await rcmClient.get(`/patients/${patientId}/ledger/entries/${entryId}`);
    return response.data;
  }

  async createAdjustment(patientId: string, payload: CreateAdjustmentInput): Promise<PatientLedgerEntry> {
    const response = await rcmClient.post(`/patients/${patientId}/ledger/adjustments`, payload);
    return response.data;
  }

  async postEntry(patientId: string, entryId: string): Promise<PatientLedgerEntry> {
    const response = await rcmClient.post(`/patients/${patientId}/ledger/entries/${entryId}/post`);
    return response.data;
  }

  async reverseEntry(patientId: string, entryId: string, payload: ReverseEntryInput): Promise<PatientLedgerEntry> {
    const response = await rcmClient.post(`/patients/${patientId}/ledger/entries/${entryId}/reverse`, payload);
    return response.data;
  }

  async createOpeningBalance(patientId: string, payload: CreateOpeningBalanceInput): Promise<PatientLedgerEntry> {
    const response = await rcmClient.post(`/patients/${patientId}/ledger/opening-balance`, payload);
    return response.data;
  }
}

export const patientLedgerService = new PatientLedgerService();
