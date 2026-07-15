import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { denialService } from '../services/denial-service';
import type { CreateAppealInput, CreateDenialInput, DenialFilters, FileAppealInput } from '../types/denial';

export function useDenials(filters?: DenialFilters) {
  return useQuery({
    queryKey: ['denials', filters],
    queryFn: () => denialService.list(filters),
  });
}

export function useDenial(id?: string) {
  return useQuery({
    queryKey: ['denial', id],
    queryFn: () => denialService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateDenial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDenialInput) => denialService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['denials'] });
    },
  });
}

export function useDraftAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ denialId, payload }: { denialId: string; payload: CreateAppealInput }) =>
      denialService.draftAppeal(denialId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['denials'] });
      queryClient.invalidateQueries({ queryKey: ['denial', variables.denialId] });
    },
  });
}

export function useFileAppeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appealId, payload }: { appealId: string; payload?: FileAppealInput }) =>
      denialService.fileAppeal(appealId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['denials'] });
      queryClient.invalidateQueries({ queryKey: ['denial'] });
    },
  });
}
