import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feeScheduleService } from '../services/fee-schedule-service';
import type {
  CreateFeeScheduleInput,
  CreateFeeScheduleItemInput,
  FeeScheduleFilters,
  FeeScheduleItemFilters,
  PriceLookupInput,
  UpdateFeeScheduleInput,
  UpdateFeeScheduleItemInput,
} from '../types/fee-schedule';

export function useFeeSchedules(filters?: FeeScheduleFilters) {
  return useQuery({
    queryKey: ['fee-schedules', filters],
    queryFn: () => feeScheduleService.list(filters),
  });
}

export function useFeeSchedule(id?: string) {
  return useQuery({
    queryKey: ['fee-schedule', id],
    queryFn: () => feeScheduleService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateFeeSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFeeScheduleInput) => feeScheduleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedules'] });
    },
  });
}

export function useUpdateFeeSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeeScheduleInput }) =>
      feeScheduleService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['fee-schedule', data.id] });
    },
  });
}

export function useDeleteFeeSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feeScheduleService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['fee-schedule', id] });
    },
  });
}

export function useFeeScheduleItems(feeScheduleId?: string, filters?: FeeScheduleItemFilters) {
  return useQuery({
    queryKey: ['fee-schedule-items', feeScheduleId, filters],
    queryFn: () => feeScheduleService.listItems(feeScheduleId!, filters),
    enabled: Boolean(feeScheduleId),
  });
}

export function useCreateFeeScheduleItem(feeScheduleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreateFeeScheduleItemInput, 'feeScheduleId'>) =>
      feeScheduleService.createItem({ feeScheduleId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedule-items', feeScheduleId] });
    },
  });
}

export function useUpdateFeeScheduleItem(feeScheduleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFeeScheduleItemInput }) =>
      feeScheduleService.updateItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedule-items', feeScheduleId] });
    },
  });
}

export function useDeleteFeeScheduleItem(feeScheduleId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feeScheduleService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-schedule-items', feeScheduleId] });
    },
  });
}

export function useFeeSchedulePriceLookup() {
  return useMutation({
    mutationFn: (payload: PriceLookupInput) => feeScheduleService.lookupPrice(payload),
  });
}
