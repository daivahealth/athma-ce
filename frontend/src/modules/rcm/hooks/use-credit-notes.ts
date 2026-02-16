import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { creditNoteService } from '../services/credit-note-service';
import type { CreditNoteFilters, CreateCreditNoteInput, UpdateCreditNoteInput, VoidCreditNoteInput } from '../types/credit-note';

export function useCreditNotes(filters?: CreditNoteFilters) {
  return useQuery({
    queryKey: ['credit-notes', filters],
    queryFn: () => creditNoteService.list(filters),
  });
}

export function useCreditNote(id?: string) {
  return useQuery({
    queryKey: ['credit-note', id],
    queryFn: () => creditNoteService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateCreditNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCreditNoteInput) => creditNoteService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-notes'] });
    },
  });
}

export function useUpdateCreditNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCreditNoteInput }) =>
      creditNoteService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['credit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['credit-note', data.id] });
    },
  });
}

export function usePostCreditNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => creditNoteService.post(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['credit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['credit-note', data.id] });
    },
  });
}

export function useVoidCreditNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VoidCreditNoteInput }) =>
      creditNoteService.void(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['credit-notes'] });
      queryClient.invalidateQueries({ queryKey: ['credit-note', data.id] });
    },
  });
}

export function useDeleteCreditNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => creditNoteService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-notes'] });
    },
  });
}
