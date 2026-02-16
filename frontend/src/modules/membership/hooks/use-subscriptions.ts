import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription-service';
import type {
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  ChangePlanInput,
  CancelSubscriptionInput,
  RenewSubscriptionInput,
  RecordBenefitUsageInput,
  SubscriptionFilters,
} from '../types/subscription';

// Subscriptions
export function useSubscriptions(filters?: SubscriptionFilters) {
  return useQuery({
    queryKey: ['subscriptions', filters],
    queryFn: () => subscriptionService.list(filters),
  });
}

export function useSubscription(id?: string) {
  return useQuery({
    queryKey: ['subscription', id],
    queryFn: () => subscriptionService.getById(id!),
    enabled: Boolean(id),
  });
}

export function usePatientSubscriptions(patientId?: string) {
  return useQuery({
    queryKey: ['patient-subscriptions', patientId],
    queryFn: () => subscriptionService.getByPatient(patientId!),
    enabled: Boolean(patientId),
  });
}

export function usePatientActiveSubscription(patientId?: string) {
  return useQuery({
    queryKey: ['patient-active-subscription', patientId],
    queryFn: () => subscriptionService.getActiveByPatient(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionInput) => subscriptionService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-active-subscription', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['membership-dashboard'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSubscriptionInput }) =>
      subscriptionService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
    },
  });
}

// Actions
export function useChangePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChangePlanInput }) =>
      subscriptionService.changePlan(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['membership-dashboard'] });
    },
  });
}

export function usePauseSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.pause(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
    },
  });
}

export function useResumeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subscriptionService.resume(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelSubscriptionInput }) =>
      subscriptionService.cancel(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-active-subscription', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['membership-dashboard'] });
    },
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RenewSubscriptionInput }) =>
      subscriptionService.renew(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-subscriptions', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices', data.id] });
      queryClient.invalidateQueries({ queryKey: ['membership-dashboard'] });
    },
  });
}

// Benefits
export function useRecordBenefitUsage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RecordBenefitUsageInput) => subscriptionService.recordBenefitUsage(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', variables.subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ['benefit-usage', variables.subscriptionId] });
    },
  });
}

export function useBenefitUsageHistory(subscriptionId?: string, options?: { benefitId?: string; limit?: number }) {
  return useQuery({
    queryKey: ['benefit-usage', subscriptionId, options],
    queryFn: () => subscriptionService.getBenefitUsageHistory(subscriptionId!, options),
    enabled: Boolean(subscriptionId),
  });
}

// Invoices
export function useSubscriptionInvoices(subscriptionId?: string) {
  return useQuery({
    queryKey: ['subscription-invoices', subscriptionId],
    queryFn: () => subscriptionService.getInvoices(subscriptionId!),
    enabled: Boolean(subscriptionId),
  });
}

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, paymentMethod }: { invoiceId: string; paymentMethod: string }) =>
      subscriptionService.markInvoicePaid(invoiceId, paymentMethod),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription-invoices', data.subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ['membership-dashboard'] });
    },
  });
}

// Dashboard
export function useMembershipDashboard() {
  return useQuery({
    queryKey: ['membership-dashboard'],
    queryFn: () => subscriptionService.getDashboard(),
  });
}

export function useUpcomingRenewals(daysAhead?: number) {
  return useQuery({
    queryKey: ['upcoming-renewals', daysAhead],
    queryFn: () => subscriptionService.getUpcomingRenewals(daysAhead),
  });
}

// Patient Membership
export function usePatientMembership(patientId?: string) {
  return useQuery({
    queryKey: ['patient-membership', patientId],
    queryFn: () => subscriptionService.getPatientMembership(patientId!),
    enabled: Boolean(patientId),
  });
}
