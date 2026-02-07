import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { refundService } from '../services/refund-service';
import type {
  AllocateRefundInput,
  ApproveRefundInput,
  CreateRefundInput,
  ProcessRefundInput,
  RefundFilters,
  RejectRefundInput,
  UpdateRefundInput,
  VoidRefundInput,
} from '../types/refund';

export function useRefunds(filters?: RefundFilters) {
  return useQuery({
    queryKey: ['refunds', filters],
    queryFn: () => refundService.list(filters),
  });
}

export function useRefund(id?: string) {
  return useQuery({
    queryKey: ['refund', id],
    queryFn: () => refundService.getById(id!),
    enabled: Boolean(id),
  });
}

export function usePatientRefunds(patientId?: string) {
  return useQuery({
    queryKey: ['refunds', 'patient', patientId],
    queryFn: () => refundService.getByPatient(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useReceiptRefunds(receiptId?: string) {
  return useQuery({
    queryKey: ['refunds', 'receipt', receiptId],
    queryFn: () => refundService.getByReceipt(receiptId!),
    enabled: Boolean(receiptId),
  });
}

export function useRefundStats(filters?: {
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['refund-stats', filters],
    queryFn: () => refundService.getStatistics(filters),
  });
}

export function useCreateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRefundInput) => refundService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}

export function useUpdateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRefundInput }) =>
      refundService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}

export function useAllocateRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AllocateRefundInput }) =>
      refundService.allocate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
    },
  });
}

export function useApproveRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApproveRefundInput }) =>
      refundService.approve(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}

export function useRejectRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectRefundInput }) =>
      refundService.reject(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}

export function useProcessRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProcessRefundInput }) =>
      refundService.process(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useVoidRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VoidRefundInput }) =>
      refundService.void(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', data.id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useDeleteRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => refundService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['refunds'] });
      queryClient.invalidateQueries({ queryKey: ['refund', id] });
      queryClient.invalidateQueries({ queryKey: ['refund-stats'] });
    },
  });
}
