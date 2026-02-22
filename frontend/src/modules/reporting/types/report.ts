/**
 * Report Builder Types
 * Types for the Natural Language Report Builder feature
 */

/**
 * Aggregation functions supported by the query planner
 */
export type AggregationFunction = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX' | 'COUNT_DISTINCT';

/**
 * Comparison operators supported in filters
 */
export type ComparisonOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'not_in'
  | 'contains'
  | 'starts_with'
  | 'between';

/**
 * Export formats supported
 */
export type ExportFormat = 'excel' | 'pdf' | 'csv';

/**
 * Column format types for display
 */
export type ColumnFormat = 'string' | 'number' | 'currency' | 'percentage' | 'date' | 'datetime';

/**
 * Result column metadata
 */
export interface ResultColumn {
  name: string;
  displayName: string;
  displayNameAr?: string;
  dataType: string;
  format?: ColumnFormat;
}

/**
 * Query execution result
 */
export interface QueryResult {
  columns: ResultColumn[];
  rows: Record<string, any>[];
  totalCount: number;
  executionTimeMs: number;
  sql?: string; // For debugging, only in development
}

/**
 * Report generation request
 */
export interface GenerateReportRequest {
  query: string;
  filters?: {
    dateFrom?: string;
    dateTo?: string;
    facilityId?: string;
    departmentId?: string;
  };
  limit?: number;
  currency?: string;
  locale?: 'en' | 'ar';
}

/**
 * Semantic metric from catalog
 */
export interface SemanticMetric {
  id: string;
  name: string;
  displayName: string;
  displayNameAr?: string;
  description?: string;
  category: string;
  format?: ColumnFormat;
  defaultAggregation?: AggregationFunction;
}

/**
 * Semantic dimension from catalog
 */
export interface SemanticDimension {
  id: string;
  name: string;
  displayName: string;
  displayNameAr?: string;
  description?: string;
  category: string;
  dataType: string;
  allowedOperators: ComparisonOperator[];
  isLookup: boolean;
  lookupValues?: string[];
}

/**
 * Semantic catalog
 */
export interface SemanticCatalog {
  metrics: SemanticMetric[];
  dimensions: SemanticDimension[];
}

/**
 * Filter condition in a query plan
 */
export interface QueryFilter {
  dimension: string;
  operator: ComparisonOperator;
  value: any;
  valueTo?: any; // For 'between' operator
}

/**
 * Order by clause in a query plan
 */
export interface QueryOrderBy {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Metric selection in a query plan
 */
export interface QueryMetric {
  name: string;
  aggregation?: AggregationFunction;
  alias?: string;
}

/**
 * Dimension selection in a query plan
 */
export interface QueryDimension {
  name: string;
  alias?: string;
}

/**
 * Query Plan - Intermediate representation between NL and SQL
 */
export interface QueryPlan {
  type: 'aggregate' | 'list' | 'detail';
  metrics: QueryMetric[];
  dimensions: QueryDimension[];
  filters: QueryFilter[];
  orderBy: QueryOrderBy[];
  limit: number;
  offset?: number;
}

/**
 * Saved Report - Persisted report definition
 */
export interface SavedReport {
  id: string;
  tenantId: string;
  createdById: string;
  name: string;
  description?: string;
  query: string;
  queryPlan?: QueryPlan;
  isPublic: boolean;
  isFavorite: boolean;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request to create a saved report
 */
export interface CreateSavedReportRequest {
  name: string;
  description?: string;
  query: string;
  queryPlan?: QueryPlan;
  isPublic?: boolean;
}

/**
 * Request to update a saved report
 */
export interface UpdateSavedReportRequest {
  name?: string;
  description?: string;
  query?: string;
  queryPlan?: QueryPlan;
  isPublic?: boolean;
}

/**
 * Paginated response for saved reports
 */
export interface SavedReportsResponse {
  data: SavedReport[];
  total: number;
  page: number;
  limit: number;
}
