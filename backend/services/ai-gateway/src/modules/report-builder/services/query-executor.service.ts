/**
 * Query Executor Service
 * Executes compiled SQL queries against the appropriate database
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { PrismaService as RcmPrismaService } from '@zeal/database-rcm';
import { PrismaService as AnalyticsPrismaService } from '@zeal/database-analytics';
import { CompiledQuery, QueryResult, SECURITY_RULES } from '../types/query-plan.types';
import { QueryPlan } from '../types/query-plan.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class QueryExecutorService {
  constructor(
    private foundationPrisma: FoundationPrismaService,
    private clinicalPrisma: ClinicalPrismaService,
    private rcmPrisma: RcmPrismaService,
    private analyticsPrisma: AnalyticsPrismaService,
  ) {}

  /**
   * Execute a compiled query and return results
   */
  async execute(compiled: CompiledQuery, plan: QueryPlan): Promise<QueryResult> {
    const startTime = Date.now();

    try {
      // Get the appropriate Prisma client
      const prisma = this.getPrismaClient(compiled.database);

      // Build parameter array for $queryRawUnsafe
      // Parameters are named p1, p2, etc. in our compiled query
      const parameterValues = Object.keys(compiled.parameters)
        .sort((a, b) => {
          const numA = parseInt(a.replace('p', ''));
          const numB = parseInt(b.replace('p', ''));
          return numA - numB;
        })
        .map((key) => compiled.parameters[key]);

      logger.debug(
        {
          database: compiled.database,
          sql: compiled.sql,
          parameterCount: parameterValues.length,
        },
        'Executing query',
      );

      // Execute with timeout
      const rows = await this.executeWithTimeout(
        prisma,
        compiled.sql,
        parameterValues,
        SECURITY_RULES.MAX_EXECUTION_TIME_MS,
      );

      const executionTimeMs = Date.now() - startTime;

      logger.info(
        {
          database: compiled.database,
          rowCount: rows.length,
          executionTimeMs,
        },
        'Query executed successfully',
      );

      return {
        columns: compiled.columns,
        rows: this.formatRows(rows, compiled.columns),
        totalCount: rows.length,
        executionTimeMs,
        plan,
      };
    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      logger.error(
        {
          error,
          database: compiled.database,
          executionTimeMs,
        },
        'Query execution failed',
      );
      throw new InternalServerErrorException('Failed to execute query');
    }
  }

  /**
   * Get the appropriate Prisma client for a database
   */
  private getPrismaClient(database: string) {
    switch (database) {
      case 'foundation':
        return this.foundationPrisma;
      case 'clinical':
        return this.clinicalPrisma;
      case 'rcm':
        return this.rcmPrisma;
      case 'analytics':
        return this.analyticsPrisma;
      default:
        throw new InternalServerErrorException(`Unknown database: ${database}`);
    }
  }

  /**
   * Execute query with timeout
   */
  private async executeWithTimeout(
    prisma: any,
    sql: string,
    parameters: any[],
    timeoutMs: number,
  ): Promise<any[]> {
    // Create a promise that rejects after timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Query timeout after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Execute the query
    const queryPromise = prisma.$queryRawUnsafe(sql, ...parameters);

    // Race between query and timeout
    return Promise.race([queryPromise, timeoutPromise]);
  }

  /**
   * Format rows according to column definitions
   */
  private formatRows(
    rows: any[],
    columns: CompiledQuery['columns'],
  ): Record<string, any>[] {
    return rows.map((row) => {
      const formattedRow: Record<string, any> = {};

      for (const column of columns) {
        const value = row[column.name];
        formattedRow[column.name] = this.formatValue(value, column.dataType, column.format);
      }

      return formattedRow;
    });
  }

  /**
   * Format a value based on its type and format
   */
  private formatValue(
    value: any,
    dataType: string,
    format?: string,
  ): any {
    if (value === null || value === undefined) {
      return null;
    }

    switch (dataType) {
      case 'decimal':
        // Convert BigInt or Decimal to number
        if (typeof value === 'bigint') {
          return Number(value);
        }
        return parseFloat(value.toString());

      case 'integer':
        if (typeof value === 'bigint') {
          return Number(value);
        }
        return parseInt(value.toString(), 10);

      case 'date':
        if (value instanceof Date) {
          return value.toISOString().split('T')[0];
        }
        return value;

      case 'datetime':
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;

      case 'boolean':
        return Boolean(value);

      default:
        return value;
    }
  }
}
