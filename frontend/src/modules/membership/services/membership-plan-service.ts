import { rcmClient } from '@/lib/api/client';
import type {
  MembershipPlan,
  CreateMembershipPlanInput,
  UpdateMembershipPlanInput,
  PlanFilters,
  PlanStatistics,
  PlanComparison,
} from '../types/membership-plan';

class MembershipPlanService {
  async list(filters?: PlanFilters): Promise<MembershipPlan[]> {
    const response = await rcmClient.get('/membership/plans', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<MembershipPlan> {
    const response = await rcmClient.get(`/membership/plans/${id}`);
    return response.data;
  }

  async getPublicPlans(facilityId?: string): Promise<MembershipPlan[]> {
    const response = await rcmClient.get('/membership/plans/public', {
      params: { facilityId },
    });
    return response.data;
  }

  async create(payload: CreateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await rcmClient.post('/membership/plans', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateMembershipPlanInput): Promise<MembershipPlan> {
    const response = await rcmClient.patch(`/membership/plans/${id}`, payload);
    return response.data;
  }

  async deactivate(id: string): Promise<MembershipPlan> {
    const response = await rcmClient.post(`/membership/plans/${id}/deactivate`);
    return response.data;
  }

  async reactivate(id: string): Promise<MembershipPlan> {
    const response = await rcmClient.post(`/membership/plans/${id}/reactivate`);
    return response.data;
  }

  async getStatistics(id: string): Promise<PlanStatistics> {
    const response = await rcmClient.get(`/membership/plans/${id}/statistics`);
    return response.data;
  }

  async comparePlans(planIds: string[]): Promise<PlanComparison> {
    const response = await rcmClient.get('/membership/plans/compare', {
      params: { planIds },
    });
    return response.data;
  }
}

export const membershipPlanService = new MembershipPlanService();
