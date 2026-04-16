import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pharmacyDispensingService } from '../services/pharmacy-dispensing-service';
import type {
  CreateDispensingInput,
  VerifyDispensingInput,
  ExecuteDispenseInput,
  DispatchToWardInput,
  CancelDispensingInput,
  ReturnDispensingInput,
  DispensingFilters,
} from '../types/dispensing';

const DISPENSING_KEYS = {
  all: ['pharmacy', 'dispensings'] as const,
  list: (filters?: DispensingFilters) => [...DISPENSING_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...DISPENSING_KEYS.all, 'detail', id] as const,
};

export function usePharmacyDispensings(filters?: DispensingFilters) {
  return useQuery({
    queryKey: DISPENSING_KEYS.list(filters),
    queryFn: () => pharmacyDispensingService.list(filters),
    staleTime: 30 * 1000,
  });
}

export function usePharmacyDispensing(id?: string) {
  return useQuery({
    queryKey: DISPENSING_KEYS.detail(id!),
    queryFn: () => pharmacyDispensingService.getById(id!),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useCreateDispensing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDispensingInput) => pharmacyDispensingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['pharmacy', 'queue'] });
    },
  });
}

export function useVerifyDispensing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VerifyDispensingInput }) =>
      pharmacyDispensingService.verify(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
    },
  });
}

export function useExecuteDispense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExecuteDispenseInput }) =>
      pharmacyDispensingService.dispense(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['pharmacy', 'stock'] });
      queryClient.invalidateQueries({ queryKey: ['pharmacy', 'queue'] });
    },
  });
}

export function useDispatchToWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DispatchToWardInput }) =>
      pharmacyDispensingService.dispatchToWard(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
    },
  });
}

export function useWardReceive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyDispensingService.wardReceive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
    },
  });
}

export function useCancelDispensing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelDispensingInput }) =>
      pharmacyDispensingService.cancel(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['pharmacy', 'queue'] });
    },
  });
}

export function useReturnDispensing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReturnDispensingInput }) =>
      pharmacyDispensingService.processReturn(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: DISPENSING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['pharmacy', 'stock'] });
    },
  });
}
