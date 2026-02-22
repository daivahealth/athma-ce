/**
 * Report Builder Service
 * Handles API calls to the AI Gateway for report generation
 */

import { aiGatewayClient } from '@/lib/api/client';
import type {
  GenerateReportRequest,
  QueryResult,
  ExportFormat,
  SemanticCatalog,
  SavedReport,
  SavedReportsResponse,
  CreateSavedReportRequest,
  UpdateSavedReportRequest,
} from '../types/report';

// Local storage key for report history
const HISTORY_KEY = 'zeal_report_history';
const MAX_HISTORY_ITEMS = 20;

export interface ReportHistoryEntry {
  id: string;
  query: string;
  executedAt: string;
  success: boolean;
  rowCount?: number;
  error?: string;
}

export interface CatalogCategory {
  name: string;
  displayName: string;
  metrics?: { name: string; displayName: string; description?: string }[];
  dimensions?: { name: string; displayName: string; description?: string }[];
}

export interface CatalogSummary {
  metricCategories: CatalogCategory[];
  dimensionCategories: CatalogCategory[];
  availableJoins: string[];
}

export interface GenerateReportResponse {
  success: boolean;
  result?: QueryResult;
  interpretation?: string;
  suggestions?: string[];
  error?: string;
}

export interface ExampleQuery {
  query: string;
  description: string;
}

class ReportService {
  /**
   * Generate a report from natural language query
   */
  async generate(request: GenerateReportRequest): Promise<GenerateReportResponse> {
    try {
      const response = await aiGatewayClient.post('/reports/generate', {
        query: request.query,
        limit: request.limit || 1000,
        format: 'json',
        debug: false,
        currency: request.currency,
        locale: request.locale,
      });

      const result: QueryResult = response.data;

      // Add to history
      this.addToHistory({
        id: crypto.randomUUID(),
        query: request.query,
        executedAt: new Date().toISOString(),
        success: true,
        rowCount: result.totalCount,
      });

      return {
        success: true,
        result,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate report';

      // Add failed query to history
      this.addToHistory({
        id: crypto.randomUUID(),
        query: request.query,
        executedAt: new Date().toISOString(),
        success: false,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get the semantic catalog (available metrics and dimensions)
   */
  async getCatalog(): Promise<SemanticCatalog> {
    const response = await aiGatewayClient.get<CatalogSummary>('/reports/catalog');
    const summary = response.data;

    // Transform to SemanticCatalog format
    const metrics = summary.metricCategories.flatMap((cat) =>
      (cat.metrics || []).map((m) => ({
        id: m.name,
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        category: cat.displayName,
        format: undefined,
        defaultAggregation: undefined,
      }))
    );

    const dimensions = summary.dimensionCategories.flatMap((cat) =>
      (cat.dimensions || []).map((d) => ({
        id: d.name,
        name: d.name,
        displayName: d.displayName,
        description: d.description,
        category: cat.displayName,
        dataType: 'string',
        allowedOperators: [] as any[],
        isLookup: false,
        lookupValues: undefined,
      }))
    );

    return { metrics, dimensions };
  }

  /**
   * Validate a natural language query without executing
   */
  async validate(query: string): Promise<{ valid: boolean; errors?: string[]; suggestions?: string[] }> {
    try {
      const response = await aiGatewayClient.post('/reports/validate', { query });
      return {
        valid: response.data.isValid,
        errors: response.data.errors,
        suggestions: response.data.suggestions,
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.response?.data?.message || error.message],
      };
    }
  }

  /**
   * Get example queries
   */
  async getExamples(): Promise<ExampleQuery[]> {
    const response = await aiGatewayClient.get('/reports/examples');
    return response.data.examples;
  }

  /**
   * Export report to specified format
   */
  async export(
    result: QueryResult,
    format: ExportFormat,
    title?: string,
    currency?: string
  ): Promise<Blob> {
    const response = await aiGatewayClient.post(
      '/reports/generate',
      {
        query: title || 'Report',
        format,
        limit: result.totalCount,
        currency,
      },
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Download export as file
   */
  async downloadExport(
    result: QueryResult,
    format: ExportFormat,
    title?: string,
    currency?: string
  ): Promise<void> {
    // For direct export, we need to re-run the query with the format parameter
    // This is a workaround since we don't have a separate export endpoint
    const blob = await this.export(result, format, title, currency);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const extension = format === 'excel' ? 'xlsx' : format;
    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `${title || 'report'}_${timestamp}.${extension}`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Get report execution history from localStorage
   */
  getHistory(): ReportHistoryEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add an entry to history
   */
  private addToHistory(entry: ReportHistoryEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      history.unshift(entry);

      // Keep only the last MAX_HISTORY_ITEMS
      const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_KEY);
  }

  // ============================================================================
  // SAVED REPORTS
  // ============================================================================

  /**
   * Get saved reports with optional filters
   */
  async getSavedReports(params?: {
    search?: string;
    favorites?: boolean;
    page?: number;
    limit?: number;
  }): Promise<SavedReportsResponse> {
    const response = await aiGatewayClient.get<SavedReportsResponse>('/reports/saved', {
      params: {
        search: params?.search,
        favorites: params?.favorites,
        page: params?.page || 1,
        limit: params?.limit || 20,
      },
    });
    return response.data;
  }

  /**
   * Get a single saved report by ID
   */
  async getSavedReport(id: string): Promise<SavedReport> {
    const response = await aiGatewayClient.get<SavedReport>(`/reports/saved/${id}`);
    return response.data;
  }

  /**
   * Create a new saved report
   */
  async createSavedReport(request: CreateSavedReportRequest): Promise<SavedReport> {
    const response = await aiGatewayClient.post<SavedReport>('/reports/saved', request);
    return response.data;
  }

  /**
   * Update an existing saved report
   */
  async updateSavedReport(id: string, request: UpdateSavedReportRequest): Promise<SavedReport> {
    const response = await aiGatewayClient.patch<SavedReport>(`/reports/saved/${id}`, request);
    return response.data;
  }

  /**
   * Delete a saved report
   */
  async deleteSavedReport(id: string): Promise<void> {
    await aiGatewayClient.delete(`/reports/saved/${id}`);
  }

  /**
   * Toggle favorite status on a saved report
   */
  async toggleFavorite(id: string): Promise<SavedReport> {
    const response = await aiGatewayClient.post<SavedReport>(`/reports/saved/${id}/favorite`);
    return response.data;
  }

  /**
   * Increment execution count (called when running a saved report)
   */
  async recordExecution(id: string): Promise<void> {
    await aiGatewayClient.post(`/reports/saved/${id}/execute`);
  }
}

export const reportService = new ReportService();
