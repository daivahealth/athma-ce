import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { medicalCodingService } from '../services/medical-coding-service';
import type {
  CodingSessionFilters,
  CreateDiagnosisInput,
  CreateProcedureInput,
  UpdateCodingSessionInput,
  UpdateDiagnosisInput,
  UpdateProcedureInput,
} from '../types/medical-coding';

export function useCodingSessions(filters?: CodingSessionFilters) {
  return useQuery({
    queryKey: ['coding-sessions', filters],
    queryFn: () => medicalCodingService.listSessions(filters),
  });
}

export function usePendingCodingSessions() {
  return useQuery({
    queryKey: ['coding-sessions', 'pending'],
    queryFn: () => medicalCodingService.listPendingSessions(),
  });
}

export function useCodingSession(id?: string) {
  return useQuery({
    queryKey: ['coding-session', id],
    queryFn: () => medicalCodingService.getSession(id!),
    enabled: Boolean(id),
  });
}

export function useStartCodingReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalCodingService.startReview(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coding-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['coding-session', data.id] });
    },
  });
}

export function useUpdateCodingSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCodingSessionInput }) =>
      medicalCodingService.updateSession(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', data.id] });
    },
  });
}

export function useSubmitCodingSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalCodingService.submitSession(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', data.id] });
      queryClient.invalidateQueries({ queryKey: ['coding-sessions'] });
    },
  });
}

export function useCodingDiagnoses(sessionId?: string) {
  return useQuery({
    queryKey: ['coding-diagnoses', sessionId],
    queryFn: () => medicalCodingService.getSession(sessionId!),
    select: (session) => session.diagnoses ?? [],
    enabled: Boolean(sessionId),
  });
}

export function useAddDiagnosis(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDiagnosisInput) => medicalCodingService.addDiagnosis(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useUpdateDiagnosis(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiagnosisInput }) =>
      medicalCodingService.updateDiagnosis(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useDeleteDiagnosis(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalCodingService.deleteDiagnosis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useAddProcedure(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProcedureInput) => medicalCodingService.addProcedure(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useUpdateProcedure(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProcedureInput }) =>
      medicalCodingService.updateProcedure(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useDeleteProcedure(sessionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicalCodingService.deleteProcedure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coding-session', sessionId] });
    },
  });
}

export function useCodingAudit(sessionId: string) {
  return useQuery({
    queryKey: ['coding-session-audit', sessionId],
    queryFn: () => medicalCodingService.getSessionAudit(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useCoderProductivity() {
  return useQuery({
    queryKey: ['medical-coding', 'productivity'],
    queryFn: () => medicalCodingService.getCoderProductivity(),
  });
}

export function useCodingSessionSummary() {
  return useQuery({
    queryKey: ['medical-coding', 'summary'],
    queryFn: () => medicalCodingService.getSessionSummary(),
  });
}
