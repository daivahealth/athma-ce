'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { oncologyService } from '../services/oncology-service';

const oncologyKeys = {
  all: ['oncology'] as const,
  diagnoses: () => [...oncologyKeys.all, 'diagnoses'] as const,
  diagnosisList: (params?: Record<string, unknown>) => [...oncologyKeys.diagnoses(), 'list', params] as const,
  diagnosisDetail: (id: string) => [...oncologyKeys.diagnoses(), 'detail', id] as const,
  registry: () => [...oncologyKeys.all, 'registry'] as const,
  registryList: (params?: Record<string, unknown>) => [...oncologyKeys.registry(), 'list', params] as const,
  registrySummary: (patientId: string) => [...oncologyKeys.registry(), 'summary', patientId] as const,
  staging: () => [...oncologyKeys.all, 'staging'] as const,
  stagingList: (params?: Record<string, unknown>) => [...oncologyKeys.staging(), 'list', params] as const,
  stagingDetail: (id: string) => [...oncologyKeys.staging(), 'detail', id] as const,
  tumorBoard: () => [...oncologyKeys.all, 'tumorBoard'] as const,
  tumorBoardList: (params?: Record<string, unknown>) => [...oncologyKeys.tumorBoard(), 'list', params] as const,
  carePlans: () => [...oncologyKeys.all, 'carePlans'] as const,
  carePlanList: (params?: Record<string, unknown>) => [...oncologyKeys.carePlans(), 'list', params] as const,
  carePlanDetail: (id: string) => [...oncologyKeys.carePlans(), 'detail', id] as const,
  protocols: () => [...oncologyKeys.all, 'protocols'] as const,
  protocolList: (params?: Record<string, unknown>) => [...oncologyKeys.protocols(), 'list', params] as const,
  protocolDetail: (id: string) => [...oncologyKeys.protocols(), 'detail', id] as const,
  orders: () => [...oncologyKeys.all, 'orders'] as const,
  orderList: (params?: Record<string, unknown>) => [...oncologyKeys.orders(), 'list', params] as const,
};

// Cancer Diagnosis
export function useCancerDiagnoses(params?: { patientId?: string; clinicalStatus?: string; cancerType?: string }) {
  return useQuery({
    queryKey: oncologyKeys.diagnosisList(params),
    queryFn: () => oncologyService.listDiagnoses(params),
  });
}

export function useCancerDiagnosis(id: string) {
  return useQuery({
    queryKey: oncologyKeys.diagnosisDetail(id),
    queryFn: () => oncologyService.getDiagnosis(id),
    enabled: !!id,
  });
}

export function useCreateCancerDiagnosis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createDiagnosis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.diagnoses() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.registry() });
    },
  });
}

export function useUpdateCancerDiagnosis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      oncologyService.updateDiagnosis(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.diagnoses() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.registry() });
    },
  });
}

// Oncology Registry
export function useOncologyRegistry(params?: { cancerType?: string; clinicalStatus?: string; search?: string }) {
  return useQuery({
    queryKey: oncologyKeys.registryList(params),
    queryFn: () => oncologyService.listRegistry(params),
  });
}

export function usePatientCancerSummary(patientId: string) {
  return useQuery({
    queryKey: oncologyKeys.registrySummary(patientId),
    queryFn: () => oncologyService.getRegistrySummary(patientId),
    enabled: !!patientId,
  });
}

// Tumor Staging
export function useStagings(params?: { patientId?: string; cancerDiagnosisId?: string; limit?: number }) {
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

// Tumor Board
export function useTumorBoardCases(params?: { status?: string; date?: string; patientId?: string }) {
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

// Oncology Care Plans
export function useOncologyCarePlans(params?: { patientId?: string; status?: string; treatmentIntent?: string; cancerDiagnosisId?: string }) {
  return useQuery({
    queryKey: oncologyKeys.carePlanList(params),
    queryFn: () => oncologyService.listCarePlans(params),
  });
}

export function useOncologyCarePlan(id: string) {
  return useQuery({
    queryKey: oncologyKeys.carePlanDetail(id),
    queryFn: () => oncologyService.getCarePlan(id),
    enabled: !!id,
  });
}

export function useCreateOncologyCarePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createCarePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.carePlans() });
    },
  });
}

export function useUpdateOncologyCarePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      oncologyService.updateCarePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.carePlans() });
    },
  });
}

export function useApproveOncologyCarePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy: string }) =>
      oncologyService.approveCarePlan(id, approvedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.carePlans() });
    },
  });
}

// Chemo Protocols (Phase 2)
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

// Chemo Orders (Phase 2)
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
