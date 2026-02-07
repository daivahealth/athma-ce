import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { claimService } from '../services/claim-service';
import type { ClaimFilters, CreateClaimInput, GenerateClaimsInput } from '../types/claims';

export function useClaims(filters?: ClaimFilters) {
  return useQuery({
    queryKey: ['claims', filters],
    queryFn: () => claimService.list(filters),
  });
}

export function useClaim(id?: string) {
  return useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useClaimStatistics() {
  return useQuery({
    queryKey: ['claim-statistics'],
    queryFn: () => claimService.getStatistics(),
  });
}

export function useClaimFormats() {
  return useQuery({
    queryKey: ['claim-formats'],
    queryFn: () => claimService.listFormats(),
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClaimInput) => claimService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim-statistics'] });
    },
  });
}

export function useGenerateClaims() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateClaimsInput) => claimService.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim-statistics'] });
    },
  });
}

export function useValidateClaim() {
  return useMutation({
    mutationFn: (id: string) => claimService.validate(id),
  });
}

export function useSubmitClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => claimService.submit(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
    },
  });
}
