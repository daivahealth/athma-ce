import { prmClient } from '@/lib/api/client';
import type { ProviderCallback } from '../types/provider';

export interface ProviderCallbackFilters {
  channel?: string;
  processed?: boolean;
  /** Page size; the server defaults to 50 and caps at 200. */
  limit?: number;
  offset?: number;
}

export interface ListProviderCallbacksResponse {
  data: ProviderCallback[];
  total: number;
  limit: number;
  offset: number;
}

class ProvidersService {
  async listCallbacks(filters?: ProviderCallbackFilters): Promise<ListProviderCallbacksResponse> {
    const response = await prmClient.get('/v1/providers/callbacks', { params: filters });
    return response.data;
  }

  async sendWebhook(channel: string, payload: Record<string, unknown>): Promise<unknown> {
    const response = await prmClient.post(`/v1/providers/webhooks/${channel}`, payload);
    return response.data;
  }
}

export const providersService = new ProvidersService();
