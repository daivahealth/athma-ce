import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogService } from '../services/catalog-service';
import type {
  CatalogFilters,
  DiagnosisFilters,
  DiagnosisVersionFilters,
  NoteTemplateFilters,
  CreateNoteTemplateInput,
  ReplaceLabTestResultTemplateItemInput,
} from '../types/catalog';

// ========================================
// MEDICATIONS
// ========================================

export function useMedications(filters?: CatalogFilters) {
  return useQuery({
    queryKey: ['medications', filters],
    queryFn: () => catalogService.listMedications(filters),
  });
}

export function useMedication(id: string | undefined) {
  return useQuery({
    queryKey: ['medication', id],
    queryFn: () => catalogService.getMedicationById(id!),
    enabled: Boolean(id),
  });
}

// ========================================
// LAB TESTS
// ========================================

export function useLabTests(filters?: CatalogFilters) {
  return useQuery({
    queryKey: ['labTests', filters],
    queryFn: () => catalogService.listLabTests(filters),
  });
}

export function useLabTest(id: string | undefined) {
  return useQuery({
    queryKey: ['labTest', id],
    queryFn: () => catalogService.getLabTestById(id!),
    enabled: Boolean(id),
  });
}

export function useLabTestResultTemplates(id: string | undefined) {
  return useQuery({
    queryKey: ['labTestResultTemplates', id],
    queryFn: () => catalogService.listLabTestResultTemplates(id!),
    enabled: Boolean(id),
  });
}

export function useReplaceLabTestResultTemplates(id: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReplaceLabTestResultTemplateItemInput[]) =>
      catalogService.replaceLabTestResultTemplates(id!, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labTest', id] });
      queryClient.invalidateQueries({ queryKey: ['labTestResultTemplates', id] });
    },
  });
}

export function useObservationCodes(category?: string) {
  return useQuery({
    queryKey: ['observationCodes', category],
    queryFn: () => catalogService.listObservationCodes(category),
  });
}

// ========================================
// IMAGING STUDIES
// ========================================

export function useImagingStudies(filters?: CatalogFilters) {
  return useQuery({
    queryKey: ['imagingStudies', filters],
    queryFn: () => catalogService.listImagingStudies(filters),
  });
}

export function useImagingStudy(id: string | undefined) {
  return useQuery({
    queryKey: ['imagingStudy', id],
    queryFn: () => catalogService.getImagingStudyById(id!),
    enabled: Boolean(id),
  });
}

// ========================================
// PROCEDURES
// ========================================

export function useProcedures(filters?: CatalogFilters) {
  return useQuery({
    queryKey: ['procedures', filters],
    queryFn: () => catalogService.listProcedures(filters),
  });
}

export function useProcedure(id: string | undefined) {
  return useQuery({
    queryKey: ['procedure', id],
    queryFn: () => catalogService.getProcedureById(id!),
    enabled: Boolean(id),
  });
}

// ========================================
// DIAGNOSES
// ========================================

export function useDiagnosisVersions(filters?: DiagnosisVersionFilters) {
  return useQuery({
    queryKey: ['diagnosisVersions', filters],
    queryFn: () => catalogService.listDiagnosisVersions(filters),
  });
}

export function useDiagnoses(filters?: DiagnosisFilters) {
  return useQuery({
    queryKey: ['diagnoses', filters],
    queryFn: () => catalogService.listDiagnoses(filters),
  });
}

export function useDiagnosis(id?: string) {
  return useQuery({
    queryKey: ['diagnosis', id],
    queryFn: () => catalogService.getDiagnosisById(id!),
    enabled: Boolean(id),
  });
}

// ========================================
// NOTE TEMPLATES
// ========================================

export function useNoteTemplates(filters?: NoteTemplateFilters) {
  return useQuery({
    queryKey: ['noteTemplates', filters],
    queryFn: () => catalogService.listNoteTemplates(filters),
  });
}

export function useNoteTemplate(id?: string) {
  return useQuery({
    queryKey: ['noteTemplate', id],
    queryFn: () => catalogService.getNoteTemplateById(id!),
    enabled: Boolean(id),
  });
}

export function useNoteTemplateStats() {
  return useQuery({
    queryKey: ['noteTemplateStats'],
    queryFn: () => catalogService.getNoteTemplateStatistics(),
  });
}

export function useCreateNoteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNoteTemplateInput) => catalogService.createNoteTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noteTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['noteTemplateStats'] });
    },
  });
}

export function useArchiveNoteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogService.archiveNoteTemplate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['noteTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['noteTemplateStats'] });
      queryClient.invalidateQueries({ queryKey: ['noteTemplate', id] });
    },
  });
}
