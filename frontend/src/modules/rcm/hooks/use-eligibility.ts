import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eligibilityService } from '../services/eligibility-service';
import type { CheckEligibilityInput, EligibilityFilters } from '../types/eligibility';

export function useEligibilityRequests(
  filters?: EligibilityFilters,
  options: { keepPreviousData?: boolean } = {},
) {
  return useQuery({
    queryKey: ['eligibility-requests', filters],
    queryFn: () => eligibilityService.list(filters),
    // Paged list screens opt in to keep the current page visible while the next page / search loads.
    // Off by default: patient-scoped callers must never show another patient's rows as a placeholder.
    placeholderData: options.keepPreviousData ? keepPreviousData : undefined,
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
