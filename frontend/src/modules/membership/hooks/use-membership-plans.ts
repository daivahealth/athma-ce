import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membershipPlanService } from '../services/membership-plan-service';
import type {
  CreateMembershipPlanInput,
  UpdateMembershipPlanInput,
  PlanFilters,
} from '../types/membership-plan';

export function useMembershipPlans(filters?: PlanFilters) {
  return useQuery({
    queryKey: ['membership-plans', filters],
    queryFn: () => membershipPlanService.list(filters),
  });
}

export function useMembershipPlan(id?: string) {
  return useQuery({
    queryKey: ['membership-plan', id],
    queryFn: () => membershipPlanService.getById(id!),
    enabled: Boolean(id),
  });
}

export function usePublicMembershipPlans(facilityId?: string) {
  return useQuery({
    queryKey: ['membership-plans-public', facilityId],
    queryFn: () => membershipPlanService.getPublicPlans(facilityId),
  });
}

export function useCreateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMembershipPlanInput) => membershipPlanService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
    },
  });
}

export function useUpdateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMembershipPlanInput }) =>
      membershipPlanService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      queryClient.invalidateQueries({ queryKey: ['membership-plan', data.id] });
    },
  });
}

export function useDeactivateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membershipPlanService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      queryClient.invalidateQueries({ queryKey: ['membership-plan', data.id] });
    },
  });
}

export function useReactivateMembershipPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => membershipPlanService.reactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      queryClient.invalidateQueries({ queryKey: ['membership-plan', data.id] });
    },
  });
}

export function useMembershipPlanStatistics(id?: string) {
  return useQuery({
    queryKey: ['membership-plan-statistics', id],
    queryFn: () => membershipPlanService.getStatistics(id!),
    enabled: Boolean(id),
  });
}

export function useCompareMembershipPlans(planIds: string[]) {
  return useQuery({
    queryKey: ['membership-plans-compare', planIds],
    queryFn: () => membershipPlanService.comparePlans(planIds),
    enabled: planIds.length >= 2,
  });
}
