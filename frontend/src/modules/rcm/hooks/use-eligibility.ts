import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eligibilityService } from '../services/eligibility-service';
import type { CheckEligibilityInput, EligibilityFilters } from '../types/eligibility';

export function useEligibilityRequests(filters?: EligibilityFilters) {
  return useQuery({
    queryKey: ['eligibility-requests', filters],
    queryFn: () => eligibilityService.list(filters),
  });
}

export function useEligibilityRequest(id?: string) {
  return useQuery({
    queryKey: ['eligibility-request', id],
    queryFn: () => eligibilityService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCheckEligibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckEligibilityInput) => eligibilityService.check(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eligibility-requests'] });
    },
  });
}
