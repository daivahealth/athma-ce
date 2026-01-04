import { prmClient } from '@/lib/api/client';
import type { ProviderCallback } from '../types/provider';

export interface ProviderCallbackFilters {
  channel?: string;
  processed?: boolean;
}

class ProvidersService {
  async listCallbacks(filters?: ProviderCallbackFilters): Promise<ProviderCallback[]> {
    const response = await prmClient.get('/v1/providers/callbacks', { params: filters });
    return response.data;
  }

  async sendWebhook(channel: string, payload: Record<string, unknown>): Promise<unknown> {
    const response = await prmClient.post(`/v1/providers/webhooks/${channel}`, payload);
    return response.data;
  }
}

export const providersService = new ProvidersService();
