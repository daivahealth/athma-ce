import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { inpatientService } from '../services/inpatient-service';
import type {
  BedBoardResponse,
  MultiWardBoardResponse,
  CreateAdmissionInput,
  CreateInpatientEventInput,
  DischargeChecklist,
  DischargePatientInput,
  InitiateDischargeInput,
  ApproveDischargeInput,
  CancelDischargeInput,
  ExecuteDischargeInput,
  MarkDischargeReadyInput,
  DischargeTransaction,
  AdmissionsSearchResponse,
  InpatientAdmission,
  InpatientEvent,
  UpdateAdmissionInput,
  UpdateDischargeChecklistInput,
  WardDashboardResponse,
  WardPatientsResponse,
  TransferPatientInput,
  TransferHistoryEntry,
  SearchAdmissionsParams,
} from '../types/inpatient';

const INPATIENT_KEYS = {
  admissions: ['inpatient', 'admissions'] as const,
  admission: (id: string) => [...INPATIENT_KEYS.admissions, id] as const,
  search: (params: SearchAdmissionsParams | undefined) => [...INPATIENT_KEYS.admissions, 'search', params] as const,
  events: (id: string) => [...INPATIENT_KEYS.admission(id), 'events'] as const,
  dischargeChecklist: (id: string) => [...INPATIENT_KEYS.admission(id), 'discharge-checklist'] as const,
  dischargeTransaction: (id: string) => [...INPATIENT_KEYS.admission(id), 'discharge-transaction'] as const,
  wards: ['inpatient', 'wards'] as const,
  bedBoard: (wardId: string, includeDischargedToday?: boolean) =>
    [...INPATIENT_KEYS.wards, wardId, 'bed-board', includeDischargedToday] as const,
  multiBoard: (params: {
    wardIds?: string[];
    includeDischargedToday?: boolean;
    statusFilter?: string[];
    acuityFilter?: string[];
    includeEmptyWards?: boolean;
  }) => [...INPATIENT_KEYS.wards, 'multi-board', params] as const,
  dashboard: (wardId: string) => [...INPATIENT_KEYS.wards, wardId, 'dashboard'] as const,
  wardPatients: (wardId: string) => [...INPATIENT_KEYS.wards, wardId, 'patients'] as const,
  transferHistory: (admissionId: string) => [...INPATIENT_KEYS.admissions, admissionId, 'transfer-history'] as const,
};

export function useCreateAdmission() {
  const queryClient = useQueryClient();
  return useMutation<InpatientAdmission, Error, CreateAdmissionInput>({
    mutationFn: (payload) => inpatientService.createAdmission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
    },
  });
}

export function useAdmission(admissionId: string) {
  return useQuery<InpatientAdmission>({
    queryKey: INPATIENT_KEYS.admission(admissionId),
    queryFn: () => inpatientService.getAdmission(admissionId),
    enabled: !!admissionId,
  });
}

export function useAdmissionsSearch(params: SearchAdmissionsParams) {
  return useQuery<AdmissionsSearchResponse>({
    queryKey: INPATIENT_KEYS.search(params),
    queryFn: () => inpatientService.searchAdmissions(params),
  });
}

export function useUpdateAdmission(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<InpatientAdmission, Error, UpdateAdmissionInput>({
    mutationFn: (payload) => inpatientService.updateAdmission(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admission(admissionId) });
    },
  });
}

export function useTransferPatient(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<InpatientAdmission, Error, TransferPatientInput>({
    mutationFn: (payload) => inpatientService.transferPatient(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admission(admissionId) });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.transferHistory(admissionId) });
    },
  });
}

export function useTransferHistory(admissionId: string, options?: { enabled?: boolean }) {
  return useQuery<TransferHistoryEntry[]>({
    queryKey: INPATIENT_KEYS.transferHistory(admissionId),
    queryFn: () => inpatientService.getTransferHistory(admissionId),
    enabled: Boolean(admissionId) && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdmissionEvents(admissionId: string) {
  return useQuery<InpatientEvent[]>({
    queryKey: INPATIENT_KEYS.events(admissionId),
    queryFn: () => inpatientService.getAdmissionEvents(admissionId),
    enabled: !!admissionId,
  });
}

export function useCreateAdmissionEvent(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<InpatientEvent, Error, CreateInpatientEventInput>({
    mutationFn: (payload) => inpatientService.createAdmissionEvent(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.events(admissionId) });
    },
  });
}

export function useDischargeChecklist(admissionId: string) {
  return useQuery<DischargeChecklist>({
    queryKey: INPATIENT_KEYS.dischargeChecklist(admissionId),
    queryFn: () => inpatientService.getDischargeChecklist(admissionId),
    enabled: !!admissionId,
  });
}

export function useUpdateDischargeChecklist(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeChecklist, Error, UpdateDischargeChecklistInput>({
    mutationFn: (payload) => inpatientService.updateDischargeChecklist(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeChecklist(admissionId) });
    },
  });
}

export function useDischargePatient(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<InpatientAdmission, Error, DischargePatientInput>({
    mutationFn: (payload) => inpatientService.dischargePatient(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admission(admissionId) });
    },
  });
}

export function useInitiateDischarge(admissionId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeTransaction, Error, InitiateDischargeInput>({
    mutationFn: (payload) => inpatientService.initiateDischarge(admissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admission(admissionId) });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeTransaction(admissionId) });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
    },
  });
}

export function useDischargeTransaction(admissionId: string) {
  return useQuery<DischargeTransaction>({
    queryKey: INPATIENT_KEYS.dischargeTransaction(admissionId),
    queryFn: () => inpatientService.getDischargeTransaction(admissionId),
    enabled: !!admissionId,
  });
}

export function useMarkDischargeReady(dischargeId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeTransaction, Error, MarkDischargeReadyInput>({
    mutationFn: (payload) => inpatientService.markDischargeReady(dischargeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeTransaction });
    },
  });
}

export function useApproveDischarge(dischargeId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeTransaction, Error, ApproveDischargeInput>({
    mutationFn: (payload) => inpatientService.approveDischarge(dischargeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeTransaction });
    },
  });
}

export function useExecuteDischarge(dischargeId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeTransaction, Error, ExecuteDischargeInput>({
    mutationFn: (payload) => inpatientService.executeDischarge(dischargeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeTransaction });
    },
  });
}

export function useCancelDischarge(dischargeId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeTransaction, Error, CancelDischargeInput>({
    mutationFn: (payload) => inpatientService.cancelDischarge(dischargeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.admissions });
      queryClient.invalidateQueries({ queryKey: INPATIENT_KEYS.dischargeTransaction });
    },
  });
}

export function useWardBedBoard(wardId: string, includeDischargedToday?: boolean) {
  return useQuery<BedBoardResponse>({
    queryKey: INPATIENT_KEYS.bedBoard(wardId, includeDischargedToday),
    queryFn: () => inpatientService.getWardBedBoard(wardId, includeDischargedToday),
    enabled: !!wardId,
  });
}

export function useMultiWardBedBoard(params: {
  wardIds?: string[];
  includeDischargedToday?: boolean;
  statusFilter?: string[];
  acuityFilter?: string[];
  includeEmptyWards?: boolean;
}, options?: { enabled?: boolean }) {
  return useQuery<MultiWardBoardResponse>({
    queryKey: INPATIENT_KEYS.multiBoard(params),
    queryFn: () => inpatientService.getMultiWardBedBoard(params),
    enabled: options?.enabled ?? true,
  });
}

export function useWardDashboard(wardId: string) {
  return useQuery<WardDashboardResponse>({
    queryKey: INPATIENT_KEYS.dashboard(wardId),
    queryFn: () => inpatientService.getWardDashboard(wardId),
    enabled: !!wardId,
  });
}

export function useWardPatients(wardId: string) {
  return useQuery<WardPatientsResponse>({
    queryKey: INPATIENT_KEYS.wardPatients(wardId),
    queryFn: () => inpatientService.getWardPatients(wardId),
    enabled: !!wardId,
  });
}
