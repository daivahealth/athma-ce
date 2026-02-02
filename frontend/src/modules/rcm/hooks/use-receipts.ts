import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { receiptService } from '../services/receipt-service';
import type {
  AllocateReceiptInput,
  CreateReceiptInput,
  ReceiptFilters,
  UpdateReceiptInput,
} from '../types/receipt';

export function useReceipts(filters?: ReceiptFilters) {
  return useQuery({
    queryKey: ['receipts', filters],
    queryFn: () => receiptService.list(filters),
  });
}

export function useReceipt(id?: string) {
  return useQuery({
    queryKey: ['receipt', id],
    queryFn: () => receiptService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useReceiptStats() {
  return useQuery({
    queryKey: ['receipt-stats'],
    queryFn: () => receiptService.getStatistics(),
  });
}

export function useCreateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReceiptInput) => receiptService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
  });
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReceiptInput }) =>
      receiptService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['receipt', data.id] });
    },
  });
}

export function useAllocateReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AllocateReceiptInput }) =>
      receiptService.allocate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['receipt', data.id] });
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => receiptService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['receipt', id] });
    },
  });
}
