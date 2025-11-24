import { rcmClient } from '@/lib/api/client';
import type {
  BillingItem,
  BillingItemFilters,
  BillingItemStatistics,
  CreateBillingItemInput,
  UpdateBillingItemInput,
} from '../types/billing-item';

class BillingItemService {
  async list(filters?: BillingItemFilters): Promise<BillingItem[]> {
    const response = await rcmClient.get('/billing-items', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<BillingItem> {
    const response = await rcmClient.get(`/billing-items/${id}`);
    return response.data;
  }

  async getStatistics(): Promise<BillingItemStatistics> {
    const response = await rcmClient.get('/billing-items/statistics');
    return response.data;
  }

  async create(payload: CreateBillingItemInput): Promise<BillingItem> {
    const response = await rcmClient.post('/billing-items', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateBillingItemInput): Promise<BillingItem> {
    const response = await rcmClient.put(`/billing-items/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/billing-items/${id}`);
  }

  async hardDelete(id: string): Promise<void> {
    await rcmClient.delete(`/billing-items/${id}/hard`);
  }
}

export const billingItemService = new BillingItemService();
