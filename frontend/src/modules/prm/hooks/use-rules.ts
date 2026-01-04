import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rulesService, type RuleFilters } from '../services/rules-service';
import type { CreateRuleInput, Rule, UpdateRuleInput } from '../types/rule';

const RULE_KEYS = {
  all: ['prm', 'rules'] as const,
  list: (filters: RuleFilters | undefined) => [...RULE_KEYS.all, 'list', filters] as const,
  detail: (ruleId: string) => [...RULE_KEYS.all, 'detail', ruleId] as const,
};

export function useRules(filters?: RuleFilters) {
  return useQuery<Rule[]>({
    queryKey: RULE_KEYS.list(filters),
    queryFn: () => rulesService.list(filters),
  });
}

export function useRule(ruleId: string) {
  return useQuery<Rule>({
    queryKey: RULE_KEYS.detail(ruleId),
    queryFn: () => rulesService.get(ruleId),
    enabled: !!ruleId,
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRuleInput) => rulesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.all });
    },
  });
}

export function useUpdateRule(ruleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateRuleInput) => rulesService.update(ruleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.all });
    },
  });
}

export function useDeleteRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ruleId: string) => rulesService.remove(ruleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.all });
    },
  });
}
