/**
 * Query Plan Types
 * Intermediate representation between natural language and SQL
 * This is the ONLY format accepted by the SQL compiler - NO free-form SQL allowed
 */

export type AggregationFunction =
  | 'SUM'
  | 'COUNT'
  | 'AVG'
  | 'MIN'
  | 'MAX'
  | 'COUNT_DISTINCT';

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
  | 'between'
  | 'is_null'
  | 'is_not_null';

export type QueryType = 'aggregate' | 'list' | 'detail';

export type SortDirection = 'asc' | 'desc';

export interface QueryMetric {
  name: string;
  aggregation?: AggregationFunction;
  alias?: string;
}

export interface QueryDimension {
  name: string;
  alias?: string;
}

export interface QueryFilter {
  dimension: string;
  operator: ComparisonOperator;
  value: any;
  valueTo?: any; // For 'between' operator
  /**
   * Optional group name for OR logic.
   * Filters with the same logicGroup are joined with OR.
   * Filters without a group (or different groups) are joined with AND.
   * Example: Two filters with logicGroup: "age_selection" would be: (filter1 OR filter2) AND other_filters
   */
  logicGroup?: string;
}

export interface QueryOrderBy {
  field: string;
  direction: SortDirection;
}

/**
 * Query Plan - The structured representation of a natural language query
 * This is what the LLM produces and the SQL compiler consumes
 */
export interface QueryPlan {
  type: QueryType;
  metrics: QueryMetric[];
  dimensions: QueryDimension[];
  filters: QueryFilter[];
  orderBy: QueryOrderBy[];
  limit: number;
  offset?: number;
}

/**
 * Query Plan with metadata for auditing
 */
export interface QueryPlanWithMetadata {
  plan: QueryPlan;
  originalQuery: string;
  confidence: number;
  suggestedFollowups?: string[];
}

/**
 * Compiled SQL query ready for execution
 */
export interface CompiledQuery {
  database: 'foundation' | 'clinical' | 'rcm' | 'analytics';
  sql: string;
  parameters: Record<string, any>;
  columns: QueryColumn[];
}

/**
 * Column metadata for result formatting
 */
export interface QueryColumn {
  name: string;
  displayName: string;
  displayNameAr?: string;
  dataType: 'string' | 'integer' | 'decimal' | 'date' | 'datetime' | 'boolean';
  format?: 'currency' | 'percentage' | 'date' | 'datetime' | 'number';
}

/**
 * Query result
 */
export interface QueryResult {
  columns: QueryColumn[];
  rows: Record<string, any>[];
  totalCount: number;
  executionTimeMs: number;
  plan: QueryPlan;
  sql?: string; // Only included in debug mode
}

/**
 * Security rules for query validation
 */
export const SECURITY_RULES = {
  // Hard limits
  MAX_ROW_LIMIT: 10000,
  MAX_EXECUTION_TIME_MS: 30000,
  DEFAULT_ROW_LIMIT: 1000,

  // Whitelist-only operators (no raw SQL)
  ALLOWED_OPERATORS: [
    'eq',
    'ne',
    'gt',
    'gte',
    'lt',
    'lte',
    'in',
    'not_in',
    'contains',
    'starts_with',
    'between',
    'is_null',
    'is_not_null',
  ] as ComparisonOperator[],

  ALLOWED_AGGREGATIONS: [
    'SUM',
    'COUNT',
    'AVG',
    'MIN',
    'MAX',
    'COUNT_DISTINCT',
  ] as AggregationFunction[],

  // SQL injection prevention patterns
  FORBIDDEN_PATTERNS: [
    /;\s*DROP/i,
    /;\s*DELETE/i,
    /;\s*UPDATE/i,
    /;\s*INSERT/i,
    /;\s*ALTER/i,
    /;\s*CREATE/i,
    /;\s*TRUNCATE/i,
    /UNION\s+SELECT/i,
    /--/,
    /\/\*/,
    /\*\//,
    /xp_/i,
    /exec\s*\(/i,
  ],

  // PHI columns requiring elevated permission
  PHI_COLUMNS: ['national_id', 'phone_number', 'email', 'address'],

  // Columns that can NEVER be selected
  BLOCKED_COLUMNS: ['password_hash', 'totp_secret', 'api_key', 'secret'],
} as const;
