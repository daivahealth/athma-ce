import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { encounterCoverageService } from '../services/encounter-coverage-service';
import type { CreateEncounterCoverageInput } from '../types/coverage';

export function useEncounterCoverages(encounterId?: string) {
  return useQuery({
    queryKey: ['encounter-coverages', encounterId],
    queryFn: () => encounterCoverageService.listByEncounter(encounterId!),
    enabled: Boolean(encounterId),
  });
}

export function useCreateEncounterCoverage(encounterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEncounterCoverageInput) => encounterCoverageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encounter-coverages', encounterId] });
    },
  });
}
