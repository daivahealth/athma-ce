import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../services/invoice-service';
import type {
  CreateInvoiceInput,
  InvoiceFilters,
  RecordPaymentInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
} from '../types/invoice';

export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoiceService.list(filters),
  });
}

export function useInvoice(id?: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useInvoiceStats(filters?: { patientId?: string; encounterId?: string }) {
  return useQuery({
    queryKey: ['invoice-stats', filters],
    queryFn: () => invoiceService.getStatistics(filters),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoiceInput) => invoiceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInvoiceInput }) =>
      invoiceService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInvoiceStatusInput }) =>
      invoiceService.updateStatus(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}

export function useRecordInvoicePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RecordPaymentInput }) =>
      invoiceService.recordPayment(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => invoiceService.cancel(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}
