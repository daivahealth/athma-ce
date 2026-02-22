/**
 * Semantic Search Hooks
 * React Query hooks for clinical document search
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchService } from '../services/search-service';
import type {
  SearchRequest,
  SimilarDocumentsRequest,
  QueueEmbeddingRequest,
  ReindexRequest,
} from '../types/search';

// Query key factory
const QUERY_KEYS = {
  all: ['semantic-search'] as const,
  stats: () => [...QUERY_KEYS.all, 'stats'] as const,
  reindexProgress: () => [...QUERY_KEYS.all, 'reindex-progress'] as const,
};

/**
 * Hook to search clinical documents
 */
export function useSemanticSearch() {
  return useMutation({
    mutationFn: (request: SearchRequest) => searchService.search(request),
  });
}

/**
 * Hook to find similar documents
 */
export function useSimilarDocuments() {
  return useMutation({
    mutationFn: (request: SimilarDocumentsRequest) => searchService.findSimilar(request),
  });
}

/**
 * Hook to queue a document for embedding
 */
export function useQueueEmbedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: QueueEmbeddingRequest) => searchService.queueForEmbedding(request),
    onSuccess: () => {
      // Invalidate stats to reflect new pending job
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats() });
    },
  });
}

/**
 * Hook to get embedding statistics
 */
export function useEmbeddingStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats(),
    queryFn: () => searchService.getStats(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

/**
 * Hook to start a reindex job
 */
export function useStartReindex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request?: ReindexRequest) => searchService.startReindex(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reindexProgress() });
    },
  });
}

/**
 * Hook to get reindex progress
 */
export function useReindexProgress(enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.reindexProgress(),
    queryFn: () => searchService.getReindexProgress(),
    enabled,
    staleTime: 5 * 1000, // 5 seconds
    refetchInterval: (query) => {
      // Poll every 2 seconds while running
      const data = query.state.data;
      return data?.status === 'running' ? 2000 : false;
    },
  });
}

/**
 * Hook to cancel a reindex job
 */
export function useCancelReindex() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => searchService.cancelReindex(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reindexProgress() });
    },
  });
}
