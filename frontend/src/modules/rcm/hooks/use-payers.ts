import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payerService } from '../services/payer-service';
import type {
  CreatePayerInput,
  UpdatePayerInput,
  PayerFilters,
  PayerStatus,
} from '../types/payer';

export function usePayers(filters?: PayerFilters) {
  return useQuery({
    queryKey: ['payers', filters],
    queryFn: () => payerService.list(filters),
  });
}

export function usePayer(id?: string) {
  return useQuery({
    queryKey: ['payer', id],
    queryFn: () => payerService.getById(id!),
    enabled: Boolean(id),
  });
}

export function usePayerStats() {
  return useQuery({
    queryKey: ['payer-stats'],
    queryFn: () => payerService.getStatistics(),
  });
}

export function useCreatePayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayerInput) => payerService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      queryClient.invalidateQueries({ queryKey: ['payer-stats'] });
    },
  });
}

export function useUpdatePayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePayerInput }) =>
      payerService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      queryClient.invalidateQueries({ queryKey: ['payer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payer', data.id] });
    },
  });
}

export function useArchivePayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payerService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      queryClient.invalidateQueries({ queryKey: ['payer-stats'] });
      queryClient.invalidateQueries({ queryKey: ['payer', id] });
    },
  });
}
