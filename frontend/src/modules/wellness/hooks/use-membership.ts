import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membershipService } from '../services/membership-service';
import type { CreateMembershipPlanInput, CreateMembershipSubscriptionInput } from '../types/membership';

export function useMembershipPlans(filters?: { isActive?: boolean }) {
    return useQuery({
        queryKey: ['membership-plans', filters],
        queryFn: () => membershipService.listPlans(filters),
    });
}

export function useMembershipPlan(id?: string) {
    return useQuery({
        queryKey: ['membership-plan', id],
        queryFn: () => membershipService.getPlanById(id!),
        enabled: Boolean(id),
    });
}

export function useCreateMembershipPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateMembershipPlanInput) => membershipService.createPlan(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
        },
    });
}

export function useUpdateMembershipPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateMembershipPlanInput> }) =>
            membershipService.updatePlan(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
            queryClient.invalidateQueries({ queryKey: ['membership-plan', variables.id] });
        },
    });
}

export function useToggleMembershipStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => membershipService.toggleStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
            queryClient.invalidateQueries({ queryKey: ['membership-plan', id] });
        },
    });
}

export function useDeleteMembershipPlan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => membershipService.deletePlan(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
        },
    });
}

// Subscription Hooks
export function useMembershipSubscriptions(filters?: { patientId?: string; status?: string }) {
    return useQuery({
        queryKey: ['membership-subscriptions', filters],
        queryFn: () => membershipService.listSubscriptions(filters),
    });
}

export function useCreateMembershipSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateMembershipSubscriptionInput) => membershipService.createSubscription(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membership-subscriptions'] });
        },
    });
}

export function useCancelMembershipSubscription() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => membershipService.cancelSubscription(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['membership-subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['membership-subscription', id] });
        },
    });
}
