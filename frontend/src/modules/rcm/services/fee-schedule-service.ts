import { rcmClient } from '@/lib/api/client';
import type {
  FeeSchedule,
  FeeScheduleFilters,
  CreateFeeScheduleInput,
  UpdateFeeScheduleInput,
  FeeScheduleItem,
  CreateFeeScheduleItemInput,
  UpdateFeeScheduleItemInput,
  FeeScheduleItemFilters,
  PriceLookupInput,
  PriceLookupResult,
} from '../types/fee-schedule';

class FeeScheduleService {
  async list(filters?: FeeScheduleFilters): Promise<FeeSchedule[]> {
    const response = await rcmClient.get('/fee-schedules', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<FeeSchedule> {
    const response = await rcmClient.get(`/fee-schedules/${id}`);
    return response.data;
  }

  async create(payload: CreateFeeScheduleInput): Promise<FeeSchedule> {
    const response = await rcmClient.post('/fee-schedules', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateFeeScheduleInput): Promise<FeeSchedule> {
    const response = await rcmClient.put(`/fee-schedules/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/fee-schedules/${id}`);
  }

  async listItems(feeScheduleId: string, filters?: FeeScheduleItemFilters): Promise<FeeScheduleItem[]> {
    const response = await rcmClient.get(`/fee-schedules/${feeScheduleId}/items`, { params: filters });
    return response.data;
  }

  async createItem(payload: CreateFeeScheduleItemInput): Promise<FeeScheduleItem> {
    const response = await rcmClient.post('/fee-schedules/items', payload);
    return response.data;
  }

  async updateItem(id: string, payload: UpdateFeeScheduleItemInput): Promise<FeeScheduleItem> {
    const response = await rcmClient.put(`/fee-schedules/items/${id}`, payload);
    return response.data;
  }

  async deleteItem(id: string): Promise<void> {
    await rcmClient.delete(`/fee-schedules/items/${id}`);
  }

  async lookupPrice(payload: PriceLookupInput): Promise<PriceLookupResult> {
    const response = await rcmClient.post('/fee-schedules/lookup-price', payload);
    return response.data;
  }
}

export const feeScheduleService = new FeeScheduleService();
