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
  orderDetail: (id: string) => [...oncologyKeys.orders(), 'detail', id] as const,
  catalogs: () => [...oncologyKeys.all, 'catalogs'] as const,
  cancerTypes: () => [...oncologyKeys.catalogs(), 'cancerTypes'] as const,
  cancerTypeList: (params?: Record<string, unknown>) => [...oncologyKeys.cancerTypes(), 'list', params] as const,
  primarySites: () => [...oncologyKeys.catalogs(), 'primarySites'] as const,
  primarySiteList: (params?: Record<string, unknown>) => [...oncologyKeys.primarySites(), 'list', params] as const,
  siteMappings: () => [...oncologyKeys.catalogs(), 'siteMappings'] as const,
  siteMappingList: (params?: Record<string, unknown>) => [...oncologyKeys.siteMappings(), 'list', params] as const,
  histologies: () => [...oncologyKeys.catalogs(), 'histologies'] as const,
  histologyList: (params?: Record<string, unknown>) => [...oncologyKeys.histologies(), 'list', params] as const,
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

export function useUpdateStaging() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      oncologyService.updateStaging(id, data),
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

export function useTumorBoardCase(id: string) {
  return useQuery({
    queryKey: [...oncologyKeys.tumorBoard(), 'detail', id] as const,
    queryFn: () => oncologyService.getTumorBoardCase(id),
    enabled: !!id,
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

export function useUpdateTumorBoardCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      oncologyService.updateTumorBoardCase(id, data),
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

// Chemo Protocols
export function useProtocols(params?: { cancerType?: string; isActive?: boolean }) {
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: oncologyKeys.protocols() }); },
  });
}

export function useUpdateProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateProtocol>[1] }) =>
      oncologyService.updateProtocol(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: oncologyKeys.protocols() }); },
  });
}

export function useDeactivateProtocol() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => oncologyService.deactivateProtocol(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: oncologyKeys.protocols() }); },
  });
}

// Chemo Orders
export function useChemoOrders(params?: { patientId?: string; status?: string; date?: string; cancerDiagnosisId?: string }) {
  return useQuery({
    queryKey: oncologyKeys.orderList(params),
    queryFn: () => oncologyService.listChemoOrders(params),
  });
}

export function useChemoOrder(id: string) {
  return useQuery({
    queryKey: oncologyKeys.orderDetail(id),
    queryFn: () => oncologyService.getChemoOrder(id),
    enabled: !!id,
  });
}

export function useCreateChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createChemoOrder,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() }); },
  });
}

export function useUpdateChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateChemoOrder>[1] }) =>
      oncologyService.updateChemoOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useApproveChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => oncologyService.approveChemoOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useVerifyChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; secondVerifiedBy?: string; nurseVerificationChecklist?: Record<string, unknown>; drugPreparationDetails?: unknown[] }) =>
      oncologyService.verifyChemoOrder(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useUpdateAdministrationProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateAdministrationProgress>[1] }) =>
      oncologyService.updateAdministrationProgress(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useStartAdministration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => oncologyService.startAdministration(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useCompleteAdministration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.completeAdministration>[1] }) =>
      oncologyService.completeAdministration(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useHoldChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => oncologyService.holdChemoOrder(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

export function useCancelChemoOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => oncologyService.cancelChemoOrder(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orders() });
      queryClient.invalidateQueries({ queryKey: oncologyKeys.orderDetail(id) });
    },
  });
}

// ── Catalog: Cancer Types ──────────────────────────────────────

export function useCancerTypes(params?: { search?: string; active?: string }) {
  return useQuery({
    queryKey: oncologyKeys.cancerTypeList(params),
    queryFn: () => oncologyService.listCancerTypes({ ...params, limit: 200 }),
  });
}

export function useCreateCancerType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createCancerType,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.cancerTypes() }),
  });
}

export function useUpdateCancerType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateCancerType>[1] }) =>
      oncologyService.updateCancerType(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.cancerTypes() }),
  });
}

// ── Catalog: Primary Sites ─────────────────────────────────────

export function usePrimarySites(params?: { search?: string; bodySystem?: string; active?: string }) {
  return useQuery({
    queryKey: oncologyKeys.primarySiteList(params),
    queryFn: () => oncologyService.listPrimarySites({ ...params, limit: 200 }),
  });
}

export function useCreatePrimarySite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createPrimarySite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.primarySites() }),
  });
}

export function useUpdatePrimarySite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updatePrimarySite>[1] }) =>
      oncologyService.updatePrimarySite(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.primarySites() }),
  });
}

// ── Catalog: Site Mappings ─────────────────────────────────────

export function useSiteMappings(params?: { cancerTypeId?: string; primarySiteId?: string; active?: string }) {
  return useQuery({
    queryKey: oncologyKeys.siteMappingList(params),
    queryFn: () => oncologyService.listSiteMappings({ ...params, limit: 500 }),
  });
}

export function useCreateSiteMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createSiteMapping,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.siteMappings() }),
  });
}

export function useUpdateSiteMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateSiteMapping>[1] }) =>
      oncologyService.updateSiteMapping(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.siteMappings() }),
  });
}

export function useDeleteSiteMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => oncologyService.deleteSiteMapping(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.siteMappings() }),
  });
}

// ── Catalog: Histologies ───────────────────────────────────────

export function useHistologies(params?: { search?: string; behaviorCode?: string; active?: string }) {
  return useQuery({
    queryKey: oncologyKeys.histologyList(params),
    queryFn: () => oncologyService.listHistologies({ ...params, limit: 200 }),
  });
}

export function useCreateHistology() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: oncologyService.createHistology,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.histologies() }),
  });
}

export function useUpdateHistology() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof oncologyService.updateHistology>[1] }) =>
      oncologyService.updateHistology(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: oncologyKeys.histologies() }),
  });
}
