import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { debitNoteService } from '../services/debit-note-service';
import type { DebitNoteFilters, CreateDebitNoteInput, UpdateDebitNoteInput, VoidDebitNoteInput } from '../types/debit-note';

export function useDebitNotes(filters?: DebitNoteFilters) {
  return useQuery({
    queryKey: ['debit-notes', filters],
    queryFn: () => debitNoteService.list(filters),
  });
}

export function useDebitNote(id?: string) {
  return useQuery({
    queryKey: ['debit-note', id],
    queryFn: () => debitNoteService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateDebitNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDebitNoteInput) => debitNoteService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debit-notes'] });
    },
  });
}

export function useUpdateDebitNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDebitNoteInput }) =>
      debitNoteService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['debit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['debit-note', data.id] });
    },
  });
}

export function usePostDebitNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debitNoteService.post(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['debit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['debit-note', data.id] });
    },
  });
}

export function useVoidDebitNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VoidDebitNoteInput }) =>
      debitNoteService.void(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['debit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['debit-note', data.id] });
    },
  });
}

export function useDeleteDebitNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => debitNoteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debit-notes'] });
    },
  });
}
