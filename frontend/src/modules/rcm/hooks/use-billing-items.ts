import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingItemService } from '../services/billing-item-service';
import type {
  BillingItemFilters,
  CreateBillingItemInput,
  UpdateBillingItemInput,
} from '../types/billing-item';

export function useBillingItems(filters?: BillingItemFilters) {
  return useQuery({
    queryKey: ['billing-items', filters],
    queryFn: () => billingItemService.list(filters),
  });
}

export function useBillingItemSearch(search: string) {
  return useQuery({
    queryKey: ['billing-items', 'search', search],
    queryFn: () =>
      billingItemService.list({ search, includeGlobal: true, isActive: true }),
    enabled: search.trim().length > 0,
  });
}

export function useBillingItem(id?: string) {
  return useQuery({
    queryKey: ['billing-item', id],
    queryFn: () => billingItemService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useBillingItemStats() {
  return useQuery({
    queryKey: ['billing-item-stats'],
    queryFn: () => billingItemService.getStatistics(),
  });
}

export function useCreateBillingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBillingItemInput) => billingItemService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-items'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item-stats'] });
    },
  });
}

export function useUpdateBillingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBillingItemInput }) =>
      billingItemService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['billing-items'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item-stats'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item', data.id] });
    },
  });
}

export function useArchiveBillingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingItemService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['billing-items'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item-stats'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item', id] });
    },
  });
}

export function useHardDeleteBillingItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => billingItemService.hardDelete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['billing-items'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item-stats'] });
      queryClient.invalidateQueries({ queryKey: ['billing-item', id] });
    },
  });
}
