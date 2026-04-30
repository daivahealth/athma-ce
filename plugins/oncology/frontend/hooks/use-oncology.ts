'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oncologyService } from '../services/oncology-service';

const oncologyKeys = {
  all: ['oncology'] as const,
  staging: () => [...oncologyKeys.all, 'staging'] as const,
  stagingList: (params?: Record<string, unknown>) => [...oncologyKeys.staging(), 'list', params] as const,
  stagingDetail: (id: string) => [...oncologyKeys.staging(), 'detail', id] as const,
  protocols: () => [...oncologyKeys.all, 'protocols'] as const,
  protocolList: (params?: Record<string, unknown>) => [...oncologyKeys.protocols(), 'list', params] as const,
  protocolDetail: (id: string) => [...oncologyKeys.protocols(), 'detail', id] as const,
  orders: () => [...oncologyKeys.all, 'orders'] as const,
  orderList: (params?: Record<string, unknown>) => [...oncologyKeys.orders(), 'list', params] as const,
  tumorBoard: () => [...oncologyKeys.all, 'tumorBoard'] as const,
  tumorBoardList: (params?: Record<string, unknown>) => [...oncologyKeys.tumorBoard(), 'list', params] as const,
};

export function useStagings(params?: { patientId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: oncologyKeys.stagingList(params),
    queryFn: () => oncologyService.listStagings(params),
  });
}

export function useStaging(id: string) {
  return useQuery({
    queryKey: oncologyKeys.stagingDetail(id),
    queryFn: () => oncologyService.getStaging(id),
    enabled: !!id,
  });
}

export function useCreateStaging() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createStaging,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.staging() });
    },
  });
}

export function useProtocols(params?: { cancerType?: string }) {
  return useQuery({
    queryKey: oncologyKeys.protocolList(params),
    queryFn: () => oncologyService.listProtocols(params),
  });
}

export function useProtocol(id: string) {
  return useQuery({
    queryKey: oncologyKeys.protocolDetail(id),
    queryFn: () => oncologyService.getProtocol(id),
    enabled: !!id,
  });
}

export function useCreateProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createProtocol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.protocols() });
    },
  });
}

export function useChemoOrders(params?: { patientId?: string; status?: string; date?: string }) {
  return useQuery({
    queryKey: oncologyKeys.orderList(params),
    queryFn: () => oncologyService.listChemoOrders(params),
  });
}

export function useCreateChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createChemoOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
    },
  });
}

export function useTumorBoardCases(params?: { status?: string; date?: string }) {
  return useQuery({
    queryKey: oncologyKeys.tumorBoardList(params),
    queryFn: () => oncologyService.listTumorBoardCases(params),
  });
}

export function useCreateTumorBoardCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createTumorBoardCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.tumorBoard() });
    },
  });
}
