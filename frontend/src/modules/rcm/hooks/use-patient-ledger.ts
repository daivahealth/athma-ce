import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { patientLedgerService } from '../services/patient-ledger-service';
import type {
  CreateAdjustmentInput,
  CreateOpeningBalanceInput,
  LedgerFilters,
  ReverseEntryInput,
} from '../types/patient-ledger';

export function usePatientLedger(patientId?: string, filters?: LedgerFilters) {
  return useQuery({
    queryKey: ['patient-ledger', patientId, filters],
    queryFn: () => patientLedgerService.getLedger(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function usePatientBalanceSummary(patientId?: string, currency?: string) {
  return useQuery({
    queryKey: ['patient-balance-summary', patientId, currency],
    queryFn: () => patientLedgerService.getBalanceSummary(patientId!, currency),
    enabled: Boolean(patientId),
  });
}

export function useLedgerEntry(patientId?: string, entryId?: string) {
  return useQuery({
    queryKey: ['ledger-entry', patientId, entryId],
    queryFn: () => patientLedgerService.getEntry(patientId!, entryId!),
    enabled: Boolean(patientId) && Boolean(entryId),
  });
}

export function useCreateAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreateAdjustmentInput }) =>
      patientLedgerService.createAdjustment(patientId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-ledger', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-balance-summary', variables.patientId] });
    },
  });
}

export function usePostEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, entryId }: { patientId: string; entryId: string }) =>
      patientLedgerService.postEntry(patientId, entryId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patient-ledger', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-balance-summary', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['ledger-entry', data.patientId, data.id] });
    },
  });
}

export function useReverseEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      entryId,
      payload,
    }: {
      patientId: string;
      entryId: string;
      payload: ReverseEntryInput;
    }) => patientLedgerService.reverseEntry(patientId, entryId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patient-ledger', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-balance-summary', data.patientId] });
    },
  });
}

export function useCreateOpeningBalance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreateOpeningBalanceInput }) =>
      patientLedgerService.createOpeningBalance(patientId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patient-ledger', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-balance-summary', variables.patientId] });
    },
  });
}
