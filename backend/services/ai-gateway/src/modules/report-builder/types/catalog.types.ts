/**
 * Semantic Catalog Types
 * Definitions for metrics, dimensions, and join paths
 */

export type DatabaseName = 'foundation' | 'clinical' | 'rcm' | 'analytics';

export type DataType =
  | 'string'
  | 'integer'
  | 'decimal'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'uuid';

export type FormatType =
  | 'currency'
  | 'percentage'
  | 'date'
  | 'datetime'
  | 'number'
  | 'text';

export type JoinType = 'inner' | 'left' | 'right';

export type Cardinality = 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';

/**
 * Semantic Metric Definition
 * Represents a measurable quantity in the system
 */
export interface SemanticMetric {
  id: string;
  tenantId: string | null; // NULL = global, UUID = tenant-specific
  name: string;
  displayName: string;
  displayNameAr?: string;
  description: string;
  expression: string; // SQL expression: 'net_amount', 'COALESCE(amount, 0)'
  database: DatabaseName;
  baseTable: string;
  dataType: DataType;
  defaultAggregation?: string; // 'SUM', 'COUNT', etc. - optional for list metrics
  requiredPermission?: string;
  category: string;
  format?: FormatType;
  isActive: boolean;
}

/**
 * Semantic Dimension Definition
 * Represents an attribute that can be used for grouping or filtering
 */
export interface SemanticDimension {
  id: string;
  tenantId: string | null;
  name: string;
  displayName: string;
  displayNameAr?: string;
  description: string;
  columnRef: string; // SQL column reference
  database: DatabaseName;
  baseTable: string;
  dataType: DataType;
  allowedOperators: string[]; // ['eq', 'gte', 'lte', 'between']
  requiredPermission?: string;
  category: string;
  isLookup: boolean;
  lookupValues?: string[]; // For enums: ['unpaid', 'paid', 'cancelled']
  isActive: boolean;
}

/**
 * Semantic Join Path Definition
 * Defines how tables can be joined for cross-table queries
 */
export interface SemanticJoinPath {
  id: string;
  tenantId: string | null;
  name: string;
  fromTable: string;
  fromDatabase: DatabaseName;
  toTable: string;
  toDatabase: DatabaseName;
  joinType: JoinType;
  joinCondition: string; // SQL join condition
  cardinality: Cardinality;
  isActive: boolean;
}

/**
 * Complete Semantic Catalog
 * Contains all metrics, dimensions, and join paths for a tenant
 */
export interface SemanticCatalog {
  metrics: SemanticMetric[];
  dimensions: SemanticDimension[];
  joinPaths: SemanticJoinPath[];
  version: string;
  lastUpdated: Date;
}

/**
 * Filtered catalog based on user permissions
 */
export interface FilteredCatalog extends SemanticCatalog {
  userPermissions: string[];
  filteredMetricCount: number;
  filteredDimensionCount: number;
}

/**
 * Metric category for organization
 */
export interface MetricCategory {
  name: string;
  displayName: string;
  displayNameAr?: string;
  metrics: SemanticMetric[];
}

/**
 * Dimension category for organization
 */
export interface DimensionCategory {
  name: string;
  displayName: string;
  displayNameAr?: string;
  dimensions: SemanticDimension[];
}

/**
 * Catalog summary for LLM context
 */
export interface CatalogSummary {
  metricCategories: MetricCategory[];
  dimensionCategories: DimensionCategory[];
  availableJoins: string[];
}
