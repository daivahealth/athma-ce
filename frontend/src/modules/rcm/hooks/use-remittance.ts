import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { remittanceService } from '../services/remittance-service';
import type { CreateRemittanceInput, RemittanceFilters } from '../types/remittance';

export function useRemittances(filters?: RemittanceFilters) {
  return useQuery({
    queryKey: ['remittances', filters],
    queryFn: () => remittanceService.list(filters),
  });
}

export function useRemittance(id?: string) {
  return useQuery({
    queryKey: ['remittance', id],
    queryFn: () => remittanceService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateRemittance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRemittanceInput) => remittanceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['remittances'] });
    },
  });
}

export function useReconcileRemittance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remittanceService.reconcile(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['remittances'] });
      queryClient.invalidateQueries({ queryKey: ['remittance', id] });
    },
  });
}
