import { clinicalClient } from '@/lib/api/client';
import type {
  CreateHieConsentRequestInput,
  FetchExternalRecordsInput,
  HieConsentRequest,
  HieFetchJob,
} from '../types/hie';

class HieService {
  async createConsentRequest(
    input: CreateHieConsentRequestInput,
  ): Promise<HieConsentRequest> {
    const response = await clinicalClient.post('/hie/consent-requests', input);
    return response.data;
  }

  async getConsentRequest(id: string): Promise<HieConsentRequest> {
    const response = await clinicalClient.get(`/hie/consent-requests/${id}`);
    return response.data;
  }

  async fetchRecords(input: FetchExternalRecordsInput): Promise<HieFetchJob> {
    const response = await clinicalClient.post('/hie/fetch', input);
    return response.data;
  }

  async getFetchStatus(jobId: string): Promise<HieFetchJob> {
    const response = await clinicalClient.get(`/hie/fetch-status/${jobId}`);
    return response.data;
  }

  async retryFetch(jobId: string): Promise<HieFetchJob> {
    const response = await clinicalClient.post(`/hie/fetch/${jobId}/retry`);
    return response.data;
  }
}

export const hieService = new HieService();
