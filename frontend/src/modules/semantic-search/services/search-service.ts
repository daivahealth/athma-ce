/**
 * Semantic Search Service
 * Handles API calls to the AI Gateway for clinical document search
 */

import { aiGatewayClient } from '@/lib/api/client';
import type {
  SearchRequest,
  SearchResponse,
  SimilarDocumentsRequest,
  QueueEmbeddingRequest,
  EmbeddingStats,
  ReindexRequest,
  ReindexProgress,
  DocumentType,
} from '../types/search';

class SemanticSearchService {
  /**
   * Search clinical documents
   */
  async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await aiGatewayClient.post<SearchResponse>('/search', {
      query: request.query,
      filters: request.filters,
      limit: request.limit || 20,
      minSimilarity: request.minSimilarity || 0.7,
    });
    return response.data;
  }

  /**
   * Find similar documents
   */
  async findSimilar(request: SimilarDocumentsRequest): Promise<SearchResponse> {
    const response = await aiGatewayClient.post<SearchResponse>('/search/similar', {
      documentId: request.documentId,
      documentType: request.documentType,
      limit: request.limit || 10,
      excludePatient: request.excludePatient,
    });
    return response.data;
  }

  /**
   * Queue a document for embedding
   */
  async queueForEmbedding(request: QueueEmbeddingRequest): Promise<{ message: string }> {
    const response = await aiGatewayClient.post<{ message: string }>('/search/embed', request);
    return response.data;
  }

  /**
   * Get embedding statistics
   */
  async getStats(): Promise<EmbeddingStats> {
    const response = await aiGatewayClient.get<EmbeddingStats>('/search/stats');
    return response.data;
  }

  /**
   * Start a reindex job
   */
  async startReindex(request?: ReindexRequest): Promise<{ jobId: string; message: string }> {
    const response = await aiGatewayClient.post<{ jobId: string; message: string }>(
      '/search/reindex',
      request
    );
    return response.data;
  }

  /**
   * Get reindex progress
   */
  async getReindexProgress(): Promise<ReindexProgress | null> {
    const response = await aiGatewayClient.get<ReindexProgress | null>('/search/reindex/status');
    return response.data;
  }

  /**
   * Cancel a reindex job
   */
  async cancelReindex(): Promise<{ success: boolean }> {
    const response = await aiGatewayClient.post<{ success: boolean }>('/search/reindex/cancel');
    return response.data;
  }

  /**
   * Get suggested search queries based on document types
   */
  getSuggestedQueries(documentTypes?: DocumentType[]): string[] {
    const suggestions: Record<string, string[]> = {
      general: [
        'Find notes mentioning diabetes',
        'Search for hypertension management',
        'Documents about chest pain evaluation',
        'Notes with surgical recommendations',
      ],
      encounter_note: [
        'Find encounter notes about respiratory symptoms',
        'Search for notes with abnormal vital signs',
        'Encounters involving medication changes',
      ],
      discharge_summary: [
        'Discharge summaries with follow-up instructions',
        'Patients discharged with new diagnoses',
        'Complex discharge plans',
      ],
      clinical_note: [
        'Clinical notes about chronic conditions',
        'Progress notes with treatment adjustments',
        'Notes mentioning lab results',
      ],
    };

    if (!documentTypes || documentTypes.length === 0) {
      return suggestions.general;
    }

    const result: string[] = [];
    for (const type of documentTypes) {
      if (suggestions[type]) {
        result.push(...suggestions[type]);
      }
    }

    return result.length > 0 ? result : suggestions.general;
  }
}

export const searchService = new SemanticSearchService();
