import { clinicalClient } from '@/lib/api/client';
import type {
    MembershipPlan,
    CreateMembershipPlanInput,
    MembershipSubscription,
    CreateMembershipSubscriptionInput,
} from '../types/membership';

class MembershipService {
    async listPlans(filters?: { isActive?: boolean }): Promise<MembershipPlan[]> {
        const response = await clinicalClient.get('/membership-plans', { params: filters });
        return response.data;
    }

    async getPlanById(id: string): Promise<MembershipPlan> {
        const response = await clinicalClient.get(`/membership-plans/${id}`);
        return response.data;
    }

    async createPlan(payload: CreateMembershipPlanInput): Promise<MembershipPlan> {
        const response = await clinicalClient.post('/membership-plans', payload);
        return response.data;
    }

    async updatePlan(id: string, payload: Partial<CreateMembershipPlanInput>): Promise<MembershipPlan> {
        const response = await clinicalClient.patch(`/membership-plans/${id}`, payload);
        return response.data;
    }

    async toggleStatus(id: string): Promise<MembershipPlan> {
        const response = await clinicalClient.patch(`/membership-plans/${id}/status`);
        return response.data;
    }

    async deletePlan(id: string): Promise<void> {
        await clinicalClient.delete(`/membership-plans/${id}`);
    }

    // Subscription Methods
    async listSubscriptions(filters?: { patientId?: string; status?: string }): Promise<MembershipSubscription[]> {
        const response = await clinicalClient.get('/membership-subscriptions', { params: filters });
        return response.data;
    }

    async getSubscriptionById(id: string): Promise<MembershipSubscription> {
        const response = await clinicalClient.get(`/membership-subscriptions/${id}`);
        return response.data;
    }

    async createSubscription(payload: CreateMembershipSubscriptionInput): Promise<MembershipSubscription> {
        const response = await clinicalClient.post('/membership-subscriptions', payload);
        return response.data;
    }

    async updateSubscription(id: string, payload: Partial<CreateMembershipSubscriptionInput>): Promise<MembershipSubscription> {
        const response = await clinicalClient.patch(`/membership-subscriptions/${id}`, payload);
        return response.data;
    }

    async cancelSubscription(id: string): Promise<MembershipSubscription> {
        const response = await clinicalClient.patch(`/membership-subscriptions/${id}/cancel`);
        return response.data;
    }

    async deleteSubscription(id: string): Promise<void> {
        await clinicalClient.delete(`/membership-subscriptions/${id}`);
    }
}

export const membershipService = new MembershipService();
