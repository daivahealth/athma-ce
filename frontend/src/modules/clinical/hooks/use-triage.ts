import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { triageService } from '../services/triage-service';
import type {
  CreateTriageInput,
  UpdateTriageInput,
  TriageRecord,
} from '../types/triage';

const TRIAGE_KEY = {
  base: ['triage'] as const,
  encounter: (encounterId: string) => [...TRIAGE_KEY.base, 'encounter', encounterId] as const,
};

export function useTriageByEncounter(encounterId?: string) {
  return useQuery<TriageRecord | null>({
    queryKey: encounterId ? TRIAGE_KEY.encounter(encounterId) : TRIAGE_KEY.base,
    queryFn: () => triageService.getByEncounter(encounterId as string),
    enabled: !!encounterId,
  });
}

export function useCreateTriage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTriageInput) => triageService.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRIAGE_KEY.encounter(data.encounterId) });
    },
  });
}

export function useUpdateTriage(encounterId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTriageInput }) =>
      triageService.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TRIAGE_KEY.encounter(encounterId ?? updated.encounterId) });
    },
  });
}
