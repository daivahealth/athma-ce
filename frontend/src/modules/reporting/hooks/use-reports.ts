/**
 * Report Builder Hooks
 * React Query hooks for report generation and management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportService } from '../services/report-service';
import type {
  GenerateReportRequest,
  ExportFormat,
  QueryResult,
  CreateSavedReportRequest,
  UpdateSavedReportRequest,
} from '../types/report';

// Query key factory
const QUERY_KEYS = {
  all: ['reports'] as const,
  catalog: () => [...QUERY_KEYS.all, 'catalog'] as const,
  examples: () => [...QUERY_KEYS.all, 'examples'] as const,
  history: () => [...QUERY_KEYS.all, 'history'] as const,
};

/**
 * Hook to fetch the semantic catalog (metrics and dimensions)
 */
export function useSemanticCatalog() {
  return useQuery({
    queryKey: QUERY_KEYS.catalog(),
    queryFn: () => reportService.getCatalog(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Hook to get example queries
 */
export function useExampleQueries() {
  return useQuery({
    queryKey: QUERY_KEYS.examples(),
    queryFn: () => reportService.getExamples(),
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
}

/**
 * Hook to generate a report from natural language query
 */
export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: GenerateReportRequest) => reportService.generate(request),
    onSuccess: () => {
      // Invalidate history to show new execution
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history() });
    },
  });
}

/**
 * Hook to get report execution history (from localStorage)
 */
export function useReportHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.history(),
    queryFn: () => reportService.getHistory(),
    staleTime: 0, // Always fresh
  });
}

/**
 * Hook to clear report history
 */
export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      reportService.clearHistory();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.history() });
    },
  });
}

/**
 * Hook to validate a query
 */
export function useValidateQuery() {
  return useMutation({
    mutationFn: (query: string) => reportService.validate(query),
  });
}

/**
 * Hook to export report
 */
export function useExportReport() {
  return useMutation({
    mutationFn: ({
      result,
      format,
      title,
      currency,
    }: {
      result: QueryResult;
      format: ExportFormat;
      title?: string;
      currency?: string;
    }) => reportService.downloadExport(result, format, title, currency),
  });
}

// ============================================================================
// SAVED REPORTS HOOKS
// ============================================================================

/**
 * Hook to fetch saved reports
 */
export function useSavedReports(params?: {
  search?: string;
  favorites?: boolean;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'saved', params],
    queryFn: () => reportService.getSavedReports(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single saved report
 */
export function useSavedReport(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.all, 'saved', id],
    queryFn: () => reportService.getSavedReport(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a saved report
 */
export function useCreateSavedReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSavedReportRequest) => reportService.createSavedReport(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'saved'] });
    },
  });
}

/**
 * Hook to update a saved report
 */
export function useUpdateSavedReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateSavedReportRequest }) =>
      reportService.updateSavedReport(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'saved'] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'saved', variables.id] });
    },
  });
}

/**
 * Hook to delete a saved report
 */
export function useDeleteSavedReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportService.deleteSavedReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'saved'] });
    },
  });
}

/**
 * Hook to toggle favorite on a saved report
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reportService.toggleFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.all, 'saved'] });
    },
  });
}
