import { prmClient } from '@/lib/api/client';
import type { CreateRuleInput, Rule, UpdateRuleInput } from '../types/rule';

export interface RuleFilters {
  isActive?: boolean;
  category?: string;
}

class RulesService {
  async list(filters?: RuleFilters): Promise<Rule[]> {
    const response = await prmClient.get('/v1/rules', { params: filters });
    return response.data;
  }

  async get(ruleId: string): Promise<Rule> {
    const response = await prmClient.get(`/v1/rules/${ruleId}`);
    return response.data;
  }

  async create(payload: CreateRuleInput): Promise<Rule> {
    const response = await prmClient.post('/v1/rules', payload);
    return response.data;
  }

  async update(ruleId: string, payload: UpdateRuleInput): Promise<Rule> {
    const response = await prmClient.patch(`/v1/rules/${ruleId}`, payload);
    return response.data;
  }

  async remove(ruleId: string): Promise<void> {
    await prmClient.delete(`/v1/rules/${ruleId}`);
  }
}

export const rulesService = new RulesService();
