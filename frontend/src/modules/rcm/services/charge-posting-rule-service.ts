import { rcmClient } from '@/lib/api/client';
import type {
  ChargePostingRule,
  ChargePostingRuleFilters,
  CreateChargePostingRuleInput,
  UpdateChargePostingRuleInput,
} from '../types/charge-posting-rule';

class ChargePostingRuleService {
  async list(filters?: ChargePostingRuleFilters): Promise<ChargePostingRule[]> {
    const response = await rcmClient.get('/charge-posting-rules', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<ChargePostingRule> {
    const response = await rcmClient.get(`/charge-posting-rules/${id}`);
    return response.data;
  }

  async create(payload: CreateChargePostingRuleInput): Promise<ChargePostingRule> {
    const response = await rcmClient.post('/charge-posting-rules', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateChargePostingRuleInput): Promise<ChargePostingRule> {
    const response = await rcmClient.put(`/charge-posting-rules/${id}`, payload);
    return response.data;
  }

  async activate(id: string): Promise<ChargePostingRule> {
    const response = await rcmClient.put(`/charge-posting-rules/${id}/activate`);
    return response.data;
  }

  async deactivate(id: string): Promise<ChargePostingRule> {
    const response = await rcmClient.put(`/charge-posting-rules/${id}/deactivate`);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/charge-posting-rules/${id}`);
  }
}

export const chargePostingRuleService = new ChargePostingRuleService();
