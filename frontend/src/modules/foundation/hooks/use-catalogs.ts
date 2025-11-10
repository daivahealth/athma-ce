import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../services/catalog-service';
import type { CatalogFilters } from '../types/catalog';

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
