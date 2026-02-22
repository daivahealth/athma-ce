/**
 * Catalog Service
 * Manages the semantic catalog of metrics and dimensions
 * Data is loaded from the Analytics database (zeal_analytics)
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as AnalyticsPrismaService } from '@zeal/database-analytics';
import {
  SemanticMetric,
  SemanticDimension,
  SemanticJoinPath,
  SemanticCatalog,
  FilteredCatalog,
  CatalogSummary,
  MetricCategory,
  DimensionCategory,
  DatabaseName,
  DataType,
  FormatType,
  JoinType,
  Cardinality,
} from '../types/catalog.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class CatalogService {
  private catalogCache: Map<string, { catalog: SemanticCatalog; expiresAt: number }> =
    new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private analyticsPrisma: AnalyticsPrismaService) {}

  /**
   * Get the full semantic catalog for a tenant
   */
  async getCatalog(tenantId: string): Promise<SemanticCatalog> {
    // Check cache
    const cached = this.catalogCache.get(tenantId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.catalog;
    }

    // Load from database
    const [metrics, dimensions, joinPaths] = await Promise.all([
      this.loadMetrics(tenantId),
      this.loadDimensions(tenantId),
      this.loadJoinPaths(tenantId),
    ]);

    const catalog: SemanticCatalog = {
      metrics,
      dimensions,
      joinPaths,
      version: '1.0',
      lastUpdated: new Date(),
    };

    // Update cache
    this.catalogCache.set(tenantId, {
      catalog,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });

    logger.info(
      {
        tenantId,
        metricCount: metrics.length,
        dimensionCount: dimensions.length,
        joinPathCount: joinPaths.length,
      },
      'Catalog loaded from database',
    );

    return catalog;
  }

  /**
   * Get catalog filtered by user permissions
   */
  async getFilteredCatalog(
    tenantId: string,
    userPermissions: string[],
  ): Promise<FilteredCatalog> {
    const catalog = await this.getCatalog(tenantId);

    // In development mode, skip permission filtering to allow testing
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Filter metrics based on permissions (skip in development)
    const filteredMetrics = isDevelopment
      ? catalog.metrics
      : catalog.metrics.filter(
          (m) => !m.requiredPermission || userPermissions.includes(m.requiredPermission),
        );

    // Filter dimensions based on permissions (skip in development)
    const filteredDimensions = isDevelopment
      ? catalog.dimensions
      : catalog.dimensions.filter(
          (d) => !d.requiredPermission || userPermissions.includes(d.requiredPermission),
        );

    return {
      ...catalog,
      metrics: filteredMetrics,
      dimensions: filteredDimensions,
      userPermissions,
      filteredMetricCount: catalog.metrics.length - filteredMetrics.length,
      filteredDimensionCount: catalog.dimensions.length - filteredDimensions.length,
    };
  }

  /**
   * Get catalog summary for LLM context
   */
  async getCatalogSummary(
    tenantId: string,
    userPermissions: string[],
  ): Promise<CatalogSummary> {
    const catalog = await this.getFilteredCatalog(tenantId, userPermissions);

    // Group metrics by category
    const metricsByCategory = new Map<string, SemanticMetric[]>();
    for (const metric of catalog.metrics) {
      const existing = metricsByCategory.get(metric.category) || [];
      existing.push(metric);
      metricsByCategory.set(metric.category, existing);
    }

    const metricCategories: MetricCategory[] = Array.from(metricsByCategory.entries()).map(
      ([name, metrics]) => ({
        name,
        displayName: this.formatCategoryName(name),
        metrics,
      }),
    );

    // Group dimensions by category
    const dimensionsByCategory = new Map<string, SemanticDimension[]>();
    for (const dimension of catalog.dimensions) {
      const existing = dimensionsByCategory.get(dimension.category) || [];
      existing.push(dimension);
      dimensionsByCategory.set(dimension.category, existing);
    }

    const dimensionCategories: DimensionCategory[] = Array.from(
      dimensionsByCategory.entries(),
    ).map(([name, dimensions]) => ({
      name,
      displayName: this.formatCategoryName(name),
      dimensions,
    }));

    // List available joins
    const availableJoins = catalog.joinPaths.map(
      (j) => `${j.fromTable} -> ${j.toTable}`,
    );

    return {
      metricCategories,
      dimensionCategories,
      availableJoins,
    };
  }

  /**
   * Get a metric by name
   */
  async getMetric(
    tenantId: string,
    metricName: string,
  ): Promise<SemanticMetric | undefined> {
    const catalog = await this.getCatalog(tenantId);
    return catalog.metrics.find((m) => m.name === metricName);
  }

  /**
   * Get a dimension by name
   */
  async getDimension(
    tenantId: string,
    dimensionName: string,
  ): Promise<SemanticDimension | undefined> {
    const catalog = await this.getCatalog(tenantId);
    return catalog.dimensions.find((d) => d.name === dimensionName);
  }

  /**
   * Invalidate cache for a tenant
   */
  invalidateCache(tenantId: string): void {
    this.catalogCache.delete(tenantId);
    logger.info({ tenantId }, 'Catalog cache invalidated');
  }

  /**
   * Load metrics from Analytics database
   * Loads both global (tenant_id = NULL) and tenant-specific metrics
   */
  private async loadMetrics(tenantId: string): Promise<SemanticMetric[]> {
    try {
      const dbMetrics = await this.analyticsPrisma.semanticMetric.findMany({
        where: {
          isActive: true,
          OR: [{ tenantId: null }, { tenantId: tenantId }],
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });

      return dbMetrics.map((m) => ({
        id: m.id,
        tenantId: m.tenantId,
        name: m.name,
        displayName: m.displayName,
        displayNameAr: m.displayNameAr || undefined,
        description: m.description || undefined,
        expression: m.expression,
        database: m.database as DatabaseName,
        baseTable: m.baseTable,
        dataType: (m.dataType || 'string') as DataType,
        defaultAggregation: m.defaultAggregation || undefined,
        requiredPermission: m.requiredPermission || undefined,
        category: m.category || 'Other',
        format: (m.format || undefined) as FormatType | undefined,
        isActive: m.isActive,
      }));
    } catch (error) {
      logger.error({ error, tenantId }, 'Failed to load metrics from database');
      return [];
    }
  }

  /**
   * Load dimensions from Analytics database
   * Loads both global (tenant_id = NULL) and tenant-specific dimensions
   */
  private async loadDimensions(tenantId: string): Promise<SemanticDimension[]> {
    try {
      const dbDimensions = await this.analyticsPrisma.semanticDimension.findMany({
        where: {
          isActive: true,
          OR: [{ tenantId: null }, { tenantId: tenantId }],
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });

      return dbDimensions.map((d) => ({
        id: d.id,
        tenantId: d.tenantId,
        name: d.name,
        displayName: d.displayName,
        displayNameAr: d.displayNameAr || undefined,
        description: d.description || undefined,
        columnRef: d.columnRef,
        database: d.database as DatabaseName,
        baseTable: d.baseTable,
        dataType: (d.dataType || 'string') as DataType,
        allowedOperators: d.allowedOperators || ['eq'],
        requiredPermission: d.requiredPermission || undefined,
        category: d.category || 'Other',
        isLookup: d.isLookup,
        lookupValues: d.lookupValues || undefined,
        isActive: d.isActive,
      }));
    } catch (error) {
      logger.error({ error, tenantId }, 'Failed to load dimensions from database');
      return [];
    }
  }

  /**
   * Load join paths from Analytics database
   * Loads both global (tenant_id = NULL) and tenant-specific join paths
   */
  private async loadJoinPaths(tenantId: string): Promise<SemanticJoinPath[]> {
    try {
      const dbJoinPaths = await this.analyticsPrisma.semanticJoinPath.findMany({
        where: {
          isActive: true,
          OR: [{ tenantId: null }, { tenantId: tenantId }],
        },
        orderBy: { name: 'asc' },
      });

      return dbJoinPaths.map((j) => ({
        id: j.id,
        tenantId: j.tenantId,
        name: j.name,
        fromTable: j.fromTable,
        fromDatabase: j.fromDatabase as DatabaseName,
        toTable: j.toTable,
        toDatabase: j.toDatabase as DatabaseName,
        joinType: j.joinType as JoinType,
        joinCondition: j.joinCondition,
        cardinality: (j.cardinality || 'one-to-many') as Cardinality,
        isActive: j.isActive,
      }));
    } catch (error) {
      logger.error({ error, tenantId }, 'Failed to load join paths from database');
      return [];
    }
  }

  private formatCategoryName(name: string): string {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
