import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { preAuthService } from '../services/preauth-service';
import type { CreatePreAuthInput, PreAuthFilters, UpdatePreAuthInput } from '../types/preauth';

export function usePreAuthRequests(filters?: PreAuthFilters) {
  return useQuery({
    queryKey: ['preauth-requests', filters],
    queryFn: () => preAuthService.list(filters),
  });
}

export function usePreAuthRequest(id?: string) {
  return useQuery({
    queryKey: ['preauth-request', id],
    queryFn: () => preAuthService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreatePreAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePreAuthInput) => preAuthService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preauth-requests'] });
    },
  });
}

export function useUpdatePreAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePreAuthInput }) =>
      preAuthService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['preauth-requests'] });
      queryClient.invalidateQueries({ queryKey: ['preauth-request', data.id] });
    },
  });
}

export function useSubmitPreAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => preAuthService.submit(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['preauth-requests'] });
      queryClient.invalidateQueries({ queryKey: ['preauth-request', data.id] });
    },
  });
}

export function useCancelPreAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => preAuthService.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['preauth-requests'] });
      queryClient.invalidateQueries({ queryKey: ['preauth-request', id] });
    },
  });
}
