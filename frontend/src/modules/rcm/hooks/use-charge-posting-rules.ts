import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { chargePostingRuleService } from '../services/charge-posting-rule-service';
import type {
  ChargePostingRuleFilters,
  CreateChargePostingRuleInput,
  UpdateChargePostingRuleInput,
} from '../types/charge-posting-rule';

export function useChargePostingRules(filters?: ChargePostingRuleFilters) {
  return useQuery({
    queryKey: ['charge-posting-rules', filters],
    queryFn: () => chargePostingRuleService.list(filters),
  });
}

export function useChargePostingRule(id?: string) {
  return useQuery({
    queryKey: ['charge-posting-rule', id],
    queryFn: () => chargePostingRuleService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateChargePostingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateChargePostingRuleInput) => chargePostingRuleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rules'] });
    },
  });
}

export function useUpdateChargePostingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateChargePostingRuleInput }) =>
      chargePostingRuleService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rules'] });
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rule', data.id] });
    },
  });
}

export function useActivateChargePostingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargePostingRuleService.activate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rules'] });
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rule', data.id] });
    },
  });
}

export function useDeactivateChargePostingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargePostingRuleService.deactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rules'] });
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rule', data.id] });
    },
  });
}

export function useDeleteChargePostingRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => chargePostingRuleService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rules'] });
      queryClient.invalidateQueries({ queryKey: ['charge-posting-rule', id] });
    },
  });
}
