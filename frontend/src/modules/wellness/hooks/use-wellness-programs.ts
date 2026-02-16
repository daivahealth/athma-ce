import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wellnessProgramService } from '../services/wellness-program-service';
import type {
  WellnessProgramTemplate,
  EnrollPatientInput,
  ScheduleSessionInput,
  CompleteSessionInput,
  ProgramFilters,
} from '../types/wellness-program';

// Templates
export function useProgramTemplates(filters?: { programType?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['program-templates', filters],
    queryFn: () => wellnessProgramService.listTemplates(filters),
  });
}

export function useProgramTemplate(id?: string) {
  return useQuery({
    queryKey: ['program-template', id],
    queryFn: () => wellnessProgramService.getTemplateById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateProgramTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<WellnessProgramTemplate>) =>
      wellnessProgramService.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['program-templates'] });
    },
  });
}

export function useUpdateProgramTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<WellnessProgramTemplate> }) =>
      wellnessProgramService.updateTemplate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-templates'] });
      queryClient.invalidateQueries({ queryKey: ['program-template', data.id] });
    },
  });
}

// Enrollments
export function useProgramEnrollments(filters?: ProgramFilters) {
  return useQuery({
    queryKey: ['program-enrollments', filters],
    queryFn: () => wellnessProgramService.listEnrollments(filters),
  });
}

export function useProgramEnrollment(id?: string) {
  return useQuery({
    queryKey: ['program-enrollment', id],
    queryFn: () => wellnessProgramService.getEnrollmentById(id!),
    enabled: Boolean(id),
  });
}

export function usePatientProgramEnrollments(patientId?: string, filters?: Omit<ProgramFilters, 'patientId'>) {
  return useQuery({
    queryKey: ['patient-program-enrollments', patientId, filters],
    queryFn: () => wellnessProgramService.getPatientEnrollments(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function usePatientActiveEnrollment(patientId?: string) {
  return useQuery({
    queryKey: ['patient-active-enrollment', patientId],
    queryFn: () => wellnessProgramService.getPatientActiveEnrollment(patientId!),
    enabled: Boolean(patientId),
  });
}

export function useEnrollPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EnrollPatientInput) => wellnessProgramService.enrollPatient(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-program-enrollments', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-active-enrollment', data.patientId] });
    },
  });
}

export function usePauseEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wellnessProgramService.pauseEnrollment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-program-enrollments', data.patientId] });
    },
  });
}

export function useResumeEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wellnessProgramService.resumeEnrollment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-program-enrollments', data.patientId] });
    },
  });
}

export function useCompleteEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wellnessProgramService.completeEnrollment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-program-enrollments', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-active-enrollment', data.patientId] });
    },
  });
}

export function useCancelEnrollment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      wellnessProgramService.cancelEnrollment(id, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['program-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-program-enrollments', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-active-enrollment', data.patientId] });
    },
  });
}

// Sessions
export function useEnrollmentSessions(enrollmentId?: string) {
  return useQuery({
    queryKey: ['enrollment-sessions', enrollmentId],
    queryFn: () => wellnessProgramService.getEnrollmentSessions(enrollmentId!),
    enabled: Boolean(enrollmentId),
  });
}

export function useScheduleSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ScheduleSessionInput) => wellnessProgramService.scheduleSession(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-sessions', data.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.enrollmentId] });
    },
  });
}

export function useStartSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => wellnessProgramService.startSession(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-sessions', data.enrollmentId] });
    },
  });
}

export function useCompleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: string; payload: CompleteSessionInput }) =>
      wellnessProgramService.completeSession(sessionId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-sessions', data.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress', data.enrollmentId] });
    },
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason?: string }) =>
      wellnessProgramService.cancelSession(sessionId, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-sessions', data.enrollmentId] });
    },
  });
}

export function useMarkSessionMissed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => wellnessProgramService.markSessionMissed(sessionId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-sessions', data.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['program-enrollment', data.enrollmentId] });
    },
  });
}

// Milestones
export function useEnrollmentMilestones(enrollmentId?: string) {
  return useQuery({
    queryKey: ['enrollment-milestones', enrollmentId],
    queryFn: () => wellnessProgramService.getEnrollmentMilestones(enrollmentId!),
    enabled: Boolean(enrollmentId),
  });
}

export function useAchieveMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, actualValue }: { milestoneId: string; actualValue?: number }) =>
      wellnessProgramService.achieveMilestone(milestoneId, actualValue),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-milestones', data.enrollmentId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress', data.enrollmentId] });
    },
  });
}

// Progress
export function useEnrollmentProgress(enrollmentId?: string) {
  return useQuery({
    queryKey: ['enrollment-progress', enrollmentId],
    queryFn: () => wellnessProgramService.getEnrollmentProgress(enrollmentId!),
    enabled: Boolean(enrollmentId),
  });
}

export function usePatientProgramHistory(patientId?: string) {
  return useQuery({
    queryKey: ['patient-program-history', patientId],
    queryFn: () => wellnessProgramService.getPatientProgramHistory(patientId!),
    enabled: Boolean(patientId),
  });
}
