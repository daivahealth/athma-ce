import { rcmClient } from '@/lib/api/client';
import type {
  Subscription,
  SubscriptionSummary,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  ChangePlanInput,
  CancelSubscriptionInput,
  RenewSubscriptionInput,
  RecordBenefitUsageInput,
  BenefitUsage,
  SubscriptionInvoice,
  MembershipDashboard,
  PatientMembership,
  SubscriptionFilters,
  UpcomingRenewal,
} from '../types/subscription';

class SubscriptionService {
  // CRUD
  async list(filters?: SubscriptionFilters): Promise<{
    data: Subscription[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const response = await rcmClient.get('/membership/subscriptions', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<Subscription> {
    const response = await rcmClient.get(`/membership/subscriptions/${id}`);
    return response.data;
  }

  async getByPatient(patientId: string): Promise<Subscription[]> {
    const response = await rcmClient.get(`/membership/subscriptions/patient/${patientId}`);
    return response.data;
  }

  async getActiveByPatient(patientId: string): Promise<Subscription | null> {
    const response = await rcmClient.get(`/membership/subscriptions/patient/${patientId}/active`);
    return response.data;
  }

  async create(payload: CreateSubscriptionInput): Promise<Subscription> {
    const response = await rcmClient.post('/membership/subscriptions', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateSubscriptionInput): Promise<Subscription> {
    const response = await rcmClient.patch(`/membership/subscriptions/${id}`, payload);
    return response.data;
  }

  // Actions
  async changePlan(id: string, payload: ChangePlanInput): Promise<Subscription> {
    const response = await rcmClient.post(`/membership/subscriptions/${id}/change-plan`, payload);
    return response.data;
  }

  async pause(id: string): Promise<Subscription> {
    const response = await rcmClient.post(`/membership/subscriptions/${id}/pause`);
    return response.data;
  }

  async resume(id: string): Promise<Subscription> {
    const response = await rcmClient.post(`/membership/subscriptions/${id}/resume`);
    return response.data;
  }

  async cancel(id: string, payload: CancelSubscriptionInput): Promise<Subscription> {
    const response = await rcmClient.post(`/membership/subscriptions/${id}/cancel`, payload);
    return response.data;
  }

  async renew(id: string, payload?: RenewSubscriptionInput): Promise<Subscription> {
    const response = await rcmClient.post(`/membership/subscriptions/${id}/renew`, payload || {});
    return response.data;
  }

  // Benefits
  async recordBenefitUsage(payload: RecordBenefitUsageInput): Promise<BenefitUsage> {
    const response = await rcmClient.post('/membership/subscriptions/benefits/record', payload);
    return response.data;
  }

  async getBenefitUsageHistory(
    subscriptionId: string,
    options?: { benefitId?: string; limit?: number },
  ): Promise<BenefitUsage[]> {
    const response = await rcmClient.get(`/membership/subscriptions/${subscriptionId}/benefits/usage`, {
      params: options,
    });
    return response.data;
  }

  // Invoices
  async getInvoices(subscriptionId: string): Promise<SubscriptionInvoice[]> {
    const response = await rcmClient.get(`/membership/subscriptions/${subscriptionId}/invoices`);
    return response.data;
  }

  async markInvoicePaid(invoiceId: string, paymentMethod: string): Promise<SubscriptionInvoice> {
    const response = await rcmClient.post(`/membership/subscriptions/invoices/${invoiceId}/mark-paid`, {
      paymentMethod,
    });
    return response.data;
  }

  // Dashboard
  async getDashboard(): Promise<MembershipDashboard> {
    const response = await rcmClient.get('/membership/subscriptions/dashboard/overview');
    return response.data;
  }

  async getUpcomingRenewals(daysAhead?: number): Promise<UpcomingRenewal[]> {
    const response = await rcmClient.get('/membership/subscriptions/dashboard/upcoming-renewals', {
      params: { daysAhead },
    });
    return response.data;
  }

  // Patient Membership
  async getPatientMembership(patientId: string): Promise<PatientMembership> {
    const [active, history] = await Promise.all([
      this.getActiveByPatient(patientId).catch(() => null),
      this.getByPatient(patientId),
    ]);

    const totalSpent = history.reduce((sum, s) => {
      // Estimate based on subscription periods
      return sum + s.price;
    }, 0);

    const memberSince = history.length > 0
      ? history.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0].startDate
      : undefined;

    return {
      activeSubscription: active || undefined,
      subscriptionHistory: history.map((s) => ({
        id: s.id,
        patientId: s.patientId,
        planName: s.planName,
        tier: s.tier,
        status: s.status,
        nextBillingDate: s.nextBillingDate,
        price: s.price,
      })),
      totalSpent,
      memberSince,
    };
  }
}

export const subscriptionService = new SubscriptionService();
