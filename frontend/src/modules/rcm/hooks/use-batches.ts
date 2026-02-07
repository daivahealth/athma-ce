import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { batchService } from '../services/batch-service';
import type { BatchFilters, CreateBatchInput } from '../types/batches';

export function useBatches(filters?: BatchFilters) {
  return useQuery({
    queryKey: ['batches', filters],
    queryFn: () => batchService.list(filters),
  });
}

export function useBatch(id?: string) {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBatchInput) => batchService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useAddClaimsToBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, claimIds }: { id: string; claimIds: string[] }) =>
      batchService.addClaims(id, claimIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', data.id] });
    },
  });
}

export function useRemoveClaimsFromBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, claimIds }: { id: string; claimIds: string[] }) =>
      batchService.removeClaims(id, claimIds),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', data.id] });
    },
  });
}

export function useCloseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => batchService.close(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', data.id] });
    },
  });
}

export function useGenerateBatchFile() {
  return useMutation({
    mutationFn: (id: string) => batchService.generate(id),
  });
}

export function useSubmitBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => batchService.submit(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', data.id] });
    },
  });
}
