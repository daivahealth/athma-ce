/**
 * SQL Compiler Service
 * Converts JSON query plans to parameterized SQL queries
 * CRITICAL: Always includes tenant_id filter for security
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  QueryPlan,
  CompiledQuery,
  QueryColumn,
  SECURITY_RULES,
  ComparisonOperator,
} from '../types/query-plan.types';
import { SemanticCatalog, DatabaseName } from '../types/catalog.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class SqlCompilerService {
  constructor(private catalogService: CatalogService) {}

  /**
   * Compile a query plan to SQL
   */
  async compile(
    plan: QueryPlan,
    tenantId: string,
  ): Promise<CompiledQuery> {
    const catalog = await this.catalogService.getCatalog(tenantId);

    // Determine target database(s) from metrics and filters
    const database = this.determineDatabase(plan, catalog);

    // Build the query components
    const { selectClauses, columns } = this.buildSelectClauses(plan, catalog);
    const fromClause = this.buildFromClause(plan, catalog);
    const { whereClause, parameters } = this.buildWhereClause(plan, catalog, tenantId);
    const groupByClause = this.buildGroupByClause(plan, catalog);
    const orderByClause = this.buildOrderByClause(plan);
    const limitClause = this.buildLimitClause(plan);

    // Assemble the SQL
    const sql = this.assembleSql(
      selectClauses,
      fromClause,
      whereClause,
      groupByClause,
      orderByClause,
      limitClause,
    );

    logger.debug(
      {
        database,
        sql,
        parameterCount: Object.keys(parameters).length,
      },
      'SQL compiled',
    );

    return {
      database,
      sql,
      parameters,
      columns,
    };
  }

  /**
   * Determine which database to query based on metrics and dimensions
   */
  private determineDatabase(plan: QueryPlan, catalog: SemanticCatalog): DatabaseName {
    // Get all referenced tables
    const tables = new Set<string>();
    const databases = new Set<DatabaseName>();

    for (const metric of plan.metrics) {
      const def = catalog.metrics.find((m) => m.name === metric.name);
      if (def) {
        tables.add(def.baseTable);
        databases.add(def.database);
      }
    }

    for (const dimension of plan.dimensions) {
      const def = catalog.dimensions.find((d) => d.name === dimension.name);
      if (def) {
        tables.add(def.baseTable);
        databases.add(def.database);
      }
    }

    for (const filter of plan.filters) {
      const def = catalog.dimensions.find((d) => d.name === filter.dimension);
      if (def) {
        tables.add(def.baseTable);
        databases.add(def.database);
      }
    }

    // For now, we only support single-database queries
    // Cross-database queries will need application-level joins
    if (databases.size > 1) {
      throw new BadRequestException(
        'Cross-database queries are not yet supported. Please query one domain at a time.',
      );
    }

    return databases.values().next().value || 'clinical';
  }

  /**
   * Build SELECT clauses from metrics and dimensions
   */
  private buildSelectClauses(
    plan: QueryPlan,
    catalog: SemanticCatalog,
  ): { selectClauses: string[]; columns: QueryColumn[] } {
    const selectClauses: string[] = [];
    const columns: QueryColumn[] = [];

    // Add dimension columns first (for grouping)
    for (const dimension of plan.dimensions) {
      const def = catalog.dimensions.find((d) => d.name === dimension.name);
      if (!def) continue;

      const alias = dimension.alias || dimension.name;
      selectClauses.push(`${def.columnRef} AS "${alias}"`);
      columns.push({
        name: alias,
        displayName: def.displayName,
        displayNameAr: def.displayNameAr,
        dataType: def.dataType as any,
      });
    }

    // Add metric columns
    for (const metric of plan.metrics) {
      const def = catalog.metrics.find((m) => m.name === metric.name);
      if (!def) continue;

      const alias = metric.alias || metric.name;
      const aggregation = metric.aggregation || def.defaultAggregation;

      let expression: string;
      if (aggregation === 'COUNT_DISTINCT') {
        expression = `COUNT(DISTINCT ${def.expression})`;
      } else if (aggregation) {
        expression = `${aggregation}(${def.expression})`;
      } else {
        expression = def.expression;
      }

      selectClauses.push(`${expression} AS "${alias}"`);
      columns.push({
        name: alias,
        displayName: def.displayName,
        displayNameAr: def.displayNameAr,
        dataType: def.dataType as any,
        format: def.format as any,
      });
    }

    return { selectClauses, columns };
  }

  /**
   * Build FROM clause with any necessary joins
   */
  private buildFromClause(plan: QueryPlan, catalog: SemanticCatalog): string {
    // Determine the primary table
    const tables = new Set<string>();

    for (const metric of plan.metrics) {
      const def = catalog.metrics.find((m) => m.name === metric.name);
      if (def) tables.add(def.baseTable);
    }

    for (const dimension of plan.dimensions) {
      const def = catalog.dimensions.find((d) => d.name === dimension.name);
      if (def) tables.add(def.baseTable);
    }

    for (const filter of plan.filters) {
      const def = catalog.dimensions.find((d) => d.name === filter.dimension);
      if (def) tables.add(def.baseTable);
    }

    // For single table queries
    if (tables.size === 1) {
      return tables.values().next().value;
    }

    // For multiple tables, find join paths
    const tableArray = Array.from(tables);
    const primaryTable = tableArray[0];
    let fromClause = primaryTable;

    for (let i = 1; i < tableArray.length; i++) {
      const joinPath = catalog.joinPaths.find(
        (j) =>
          (j.fromTable === primaryTable && j.toTable === tableArray[i]) ||
          (j.toTable === primaryTable && j.fromTable === tableArray[i]),
      );

      if (joinPath) {
        const joinType = joinPath.joinType.toUpperCase();
        fromClause += ` ${joinType} JOIN ${tableArray[i]} ON ${joinPath.joinCondition}`;
      }
    }

    return fromClause;
  }

  /**
   * Build WHERE clause with MANDATORY tenant_id filter
   */
  private buildWhereClause(
    plan: QueryPlan,
    catalog: SemanticCatalog,
    tenantId: string,
  ): { whereClause: string; parameters: Record<string, any> } {
    const conditions: string[] = [];
    const parameters: Record<string, any> = {};
    let paramIndex = 1;

    // CRITICAL: Always add tenant_id filter FIRST
    conditions.push(`tenant_id = $${paramIndex}`);
    parameters[`p${paramIndex}`] = tenantId;
    paramIndex++;

    // Process plan filters
    for (const filter of plan.filters) {
      const def = catalog.dimensions.find((d) => d.name === filter.dimension);
      if (!def) continue;

      const column = def.columnRef;
      const { condition, newParams, newParamIndex } = this.buildFilterCondition(
        column,
        filter.operator,
        filter.value,
        filter.valueTo,
        paramIndex,
      );

      conditions.push(condition);
      Object.assign(parameters, newParams);
      paramIndex = newParamIndex;
    }

    return {
      whereClause: conditions.join(' AND '),
      parameters,
    };
  }

  /**
   * Build a single filter condition
   */
  private buildFilterCondition(
    column: string,
    operator: ComparisonOperator,
    value: any,
    valueTo: any,
    paramIndex: number,
  ): { condition: string; newParams: Record<string, any>; newParamIndex: number } {
    const params: Record<string, any> = {};
    let condition: string;

    // Handle special date values
    const processedValue = this.processDateValue(value);
    const processedValueTo = valueTo ? this.processDateValue(valueTo) : undefined;

    switch (operator) {
      case 'eq':
        condition = `${column} = $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'ne':
        condition = `${column} != $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'gt':
        condition = `${column} > $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'gte':
        condition = `${column} >= $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'lt':
        condition = `${column} < $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'lte':
        condition = `${column} <= $${paramIndex}`;
        params[`p${paramIndex}`] = processedValue;
        paramIndex++;
        break;

      case 'in':
        const inValues = Array.isArray(processedValue) ? processedValue : [processedValue];
        const inPlaceholders = inValues.map((_, i) => `$${paramIndex + i}`).join(', ');
        condition = `${column} IN (${inPlaceholders})`;
        inValues.forEach((v, i) => {
          params[`p${paramIndex + i}`] = v;
        });
        paramIndex += inValues.length;
        break;

      case 'not_in':
        const notInValues = Array.isArray(processedValue) ? processedValue : [processedValue];
        const notInPlaceholders = notInValues.map((_, i) => `$${paramIndex + i}`).join(', ');
        condition = `${column} NOT IN (${notInPlaceholders})`;
        notInValues.forEach((v, i) => {
          params[`p${paramIndex + i}`] = v;
        });
        paramIndex += notInValues.length;
        break;

      case 'contains':
        condition = `${column} ILIKE $${paramIndex}`;
        params[`p${paramIndex}`] = `%${processedValue}%`;
        paramIndex++;
        break;

      case 'starts_with':
        condition = `${column} ILIKE $${paramIndex}`;
        params[`p${paramIndex}`] = `${processedValue}%`;
        paramIndex++;
        break;

      case 'between':
        condition = `${column} BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        params[`p${paramIndex}`] = processedValue;
        params[`p${paramIndex + 1}`] = processedValueTo;
        paramIndex += 2;
        break;

      case 'is_null':
        condition = `${column} IS NULL`;
        break;

      case 'is_not_null':
        condition = `${column} IS NOT NULL`;
        break;

      default:
        throw new BadRequestException(`Unsupported operator: ${operator}`);
    }

    return { condition, newParams: params, newParamIndex: paramIndex };
  }

  /**
   * Process special date values like TODAY, THIS_MONTH, etc.
   */
  private processDateValue(value: any): any {
    if (typeof value !== 'string') return value;

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    switch (value.toUpperCase()) {
      case 'TODAY':
        return `${yyyy}-${mm}-${dd}`;
      case 'YESTERDAY':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
      case 'THIS_MONTH_START':
        return `${yyyy}-${mm}-01`;
      case 'THIS_YEAR_START':
        return `${yyyy}-01-01`;
      default:
        return value;
    }
  }

  /**
   * Build GROUP BY clause
   */
  private buildGroupByClause(plan: QueryPlan, catalog: SemanticCatalog): string {
    if (plan.dimensions.length === 0) return '';

    const groupByColumns = plan.dimensions.map((d) => {
      const def = catalog.dimensions.find((dim) => dim.name === d.name);
      return def?.columnRef || d.name;
    });

    return `GROUP BY ${groupByColumns.join(', ')}`;
  }

  /**
   * Build ORDER BY clause
   */
  private buildOrderByClause(plan: QueryPlan): string {
    if (plan.orderBy.length === 0) return '';

    const orderClauses = plan.orderBy.map(
      (o) => `"${o.field}" ${o.direction.toUpperCase()}`,
    );

    return `ORDER BY ${orderClauses.join(', ')}`;
  }

  /**
   * Build LIMIT clause
   */
  private buildLimitClause(plan: QueryPlan): string {
    const limit = Math.min(plan.limit || 1000, SECURITY_RULES.MAX_ROW_LIMIT);
    let clause = `LIMIT ${limit}`;

    if (plan.offset && plan.offset > 0) {
      clause += ` OFFSET ${plan.offset}`;
    }

    return clause;
  }

  /**
   * Assemble the final SQL query
   */
  private assembleSql(
    selectClauses: string[],
    fromClause: string,
    whereClause: string,
    groupByClause: string,
    orderByClause: string,
    limitClause: string,
  ): string {
    const parts = [
      `SELECT ${selectClauses.join(', ')}`,
      `FROM ${fromClause}`,
      `WHERE ${whereClause}`,
    ];

    if (groupByClause) parts.push(groupByClause);
    if (orderByClause) parts.push(orderByClause);
    if (limitClause) parts.push(limitClause);

    return parts.join('\n');
  }
}
