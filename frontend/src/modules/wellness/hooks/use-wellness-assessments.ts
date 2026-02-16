import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wellnessAssessmentService } from '../services/wellness-assessment-service';
import type {
  CreateAssessmentTemplateInput,
  CreateAssessmentInput,
  SubmitAssessmentInput,
  AssessmentFilters,
  WellnessAssessmentStatus,
} from '../types/wellness-assessment';

// Templates
export function useAssessmentTemplates(filters?: { category?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['assessment-templates', filters],
    queryFn: () => wellnessAssessmentService.listTemplates(filters),
  });
}

export function useAssessmentTemplate(id?: string) {
  return useQuery({
    queryKey: ['assessment-template', id],
    queryFn: () => wellnessAssessmentService.getTemplateById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateAssessmentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentTemplateInput) =>
      wellnessAssessmentService.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-templates'] });
    },
  });
}

export function useUpdateAssessmentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateAssessmentTemplateInput> }) =>
      wellnessAssessmentService.updateTemplate(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessment-templates'] });
      queryClient.invalidateQueries({ queryKey: ['assessment-template', data.id] });
    },
  });
}

// Assessments
export function useWellnessAssessments(filters?: AssessmentFilters) {
  return useQuery({
    queryKey: ['wellness-assessments', filters],
    queryFn: () => wellnessAssessmentService.listAssessments(filters),
  });
}

export function useWellnessAssessment(id?: string) {
  return useQuery({
    queryKey: ['wellness-assessment', id],
    queryFn: () => wellnessAssessmentService.getAssessmentById(id!),
    enabled: Boolean(id),
  });
}

export function usePatientAssessments(patientId?: string, filters?: Omit<AssessmentFilters, 'patientId'>) {
  return useQuery({
    queryKey: ['patient-assessments', patientId, filters],
    queryFn: () => wellnessAssessmentService.getPatientAssessments(patientId!, filters),
    enabled: Boolean(patientId),
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssessmentInput) =>
      wellnessAssessmentService.createAssessment(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wellness-assessments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-assessments', data.patientId] });
    },
  });
}

export function useSubmitAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SubmitAssessmentInput }) =>
      wellnessAssessmentService.submitAssessment(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wellness-assessments'] });
      queryClient.invalidateQueries({ queryKey: ['wellness-assessment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-assessments', data.patientId] });
      queryClient.invalidateQueries({ queryKey: ['patient-score-history', data.patientId] });
    },
  });
}

export function useCancelAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => wellnessAssessmentService.cancelAssessment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['wellness-assessments'] });
      queryClient.invalidateQueries({ queryKey: ['wellness-assessment', data.id] });
      queryClient.invalidateQueries({ queryKey: ['patient-assessments', data.patientId] });
    },
  });
}

// Score History
export function usePatientScoreHistory(patientId?: string, daysBack?: number) {
  return useQuery({
    queryKey: ['patient-score-history', patientId, daysBack],
    queryFn: () => wellnessAssessmentService.getPatientScoreHistory(patientId!, daysBack),
    enabled: Boolean(patientId),
  });
}

export function usePatientScoreTrend(patientId?: string) {
  return useQuery({
    queryKey: ['patient-score-trend', patientId],
    queryFn: () => wellnessAssessmentService.getPatientScoreTrend(patientId!),
    enabled: Boolean(patientId),
  });
}
