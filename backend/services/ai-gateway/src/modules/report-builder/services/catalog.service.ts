/**
 * Catalog Service
 * Manages the semantic catalog of metrics and dimensions
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import {
  SemanticMetric,
  SemanticDimension,
  SemanticJoinPath,
  SemanticCatalog,
  FilteredCatalog,
  CatalogSummary,
  MetricCategory,
  DimensionCategory,
} from '../types/catalog.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class CatalogService {
  private catalogCache: Map<string, { catalog: SemanticCatalog; expiresAt: number }> =
    new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  constructor(private foundationPrisma: FoundationPrismaService) {}

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

    // Filter metrics based on permissions
    const filteredMetrics = catalog.metrics.filter(
      (m) => !m.requiredPermission || userPermissions.includes(m.requiredPermission),
    );

    // Filter dimensions based on permissions
    const filteredDimensions = catalog.dimensions.filter(
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
   * Load metrics from database
   */
  private async loadMetrics(tenantId: string): Promise<SemanticMetric[]> {
    // For now, return hardcoded metrics until schema is added
    // TODO: Replace with actual database query once schema is in place
    return this.getDefaultMetrics();
  }

  /**
   * Load dimensions from database
   */
  private async loadDimensions(tenantId: string): Promise<SemanticDimension[]> {
    // For now, return hardcoded dimensions until schema is added
    // TODO: Replace with actual database query once schema is in place
    return this.getDefaultDimensions();
  }

  /**
   * Load join paths from database
   */
  private async loadJoinPaths(tenantId: string): Promise<SemanticJoinPath[]> {
    // For now, return hardcoded join paths until schema is added
    // TODO: Replace with actual database query once schema is in place
    return this.getDefaultJoinPaths();
  }

  /**
   * Default metrics for initial implementation
   */
  private getDefaultMetrics(): SemanticMetric[] {
    return [
      {
        id: 'metric-001',
        tenantId: null,
        name: 'total_revenue',
        displayName: 'Total Revenue',
        displayNameAr: 'إجمالي الإيرادات',
        description: 'Sum of all invoice net amounts',
        expression: 'net_amount',
        database: 'rcm',
        baseTable: 'invoices',
        dataType: 'decimal',
        defaultAggregation: 'SUM',
        requiredPermission: 'rcm.reports.revenue',
        category: 'Revenue',
        format: 'currency',
        isActive: true,
      },
      {
        id: 'metric-002',
        tenantId: null,
        name: 'invoice_count',
        displayName: 'Invoice Count',
        displayNameAr: 'عدد الفواتير',
        description: 'Count of invoices',
        expression: '1',
        database: 'rcm',
        baseTable: 'invoices',
        dataType: 'integer',
        defaultAggregation: 'COUNT',
        requiredPermission: 'rcm.reports.invoices',
        category: 'Revenue',
        format: 'number',
        isActive: true,
      },
      {
        id: 'metric-003',
        tenantId: null,
        name: 'patient_count',
        displayName: 'Patient Count',
        displayNameAr: 'عدد المرضى',
        description: 'Count of unique patients',
        expression: 'id',
        database: 'clinical',
        baseTable: 'patients',
        dataType: 'integer',
        defaultAggregation: 'COUNT_DISTINCT',
        requiredPermission: 'clinical.reports.patients',
        category: 'Clinical',
        format: 'number',
        isActive: true,
      },
      {
        id: 'metric-004',
        tenantId: null,
        name: 'encounter_count',
        displayName: 'Encounter Count',
        displayNameAr: 'عدد الزيارات',
        description: 'Count of patient encounters',
        expression: '1',
        database: 'clinical',
        baseTable: 'encounters',
        dataType: 'integer',
        defaultAggregation: 'COUNT',
        requiredPermission: 'clinical.reports.encounters',
        category: 'Clinical',
        format: 'number',
        isActive: true,
      },
      {
        id: 'metric-005',
        tenantId: null,
        name: 'outstanding_balance',
        displayName: 'Outstanding Balance',
        displayNameAr: 'الرصيد المستحق',
        description: 'Sum of unpaid invoice amounts',
        expression: 'balance_due',
        database: 'rcm',
        baseTable: 'invoices',
        dataType: 'decimal',
        defaultAggregation: 'SUM',
        requiredPermission: 'rcm.reports.aging',
        category: 'Revenue',
        format: 'currency',
        isActive: true,
      },
      {
        id: 'metric-006',
        tenantId: null,
        name: 'appointment_count',
        displayName: 'Appointment Count',
        displayNameAr: 'عدد المواعيد',
        description: 'Count of scheduled appointments',
        expression: '1',
        database: 'clinical',
        baseTable: 'appointments',
        dataType: 'integer',
        defaultAggregation: 'COUNT',
        requiredPermission: 'clinical.reports.appointments',
        category: 'Scheduling',
        format: 'number',
        isActive: true,
      },
    ];
  }

  /**
   * Default dimensions for initial implementation
   */
  private getDefaultDimensions(): SemanticDimension[] {
    return [
      {
        id: 'dim-001',
        tenantId: null,
        name: 'invoice_date',
        displayName: 'Invoice Date',
        displayNameAr: 'تاريخ الفاتورة',
        description: 'Date when the invoice was created',
        columnRef: 'invoice_date',
        database: 'rcm',
        baseTable: 'invoices',
        dataType: 'date',
        allowedOperators: ['eq', 'gte', 'lte', 'between'],
        category: 'Time',
        isLookup: false,
        isActive: true,
      },
      {
        id: 'dim-002',
        tenantId: null,
        name: 'invoice_status',
        displayName: 'Invoice Status',
        displayNameAr: 'حالة الفاتورة',
        description: 'Payment status of the invoice',
        columnRef: 'status',
        database: 'rcm',
        baseTable: 'invoices',
        dataType: 'string',
        allowedOperators: ['eq', 'in', 'not_in'],
        category: 'Status',
        isLookup: true,
        lookupValues: ['draft', 'unpaid', 'partial', 'paid', 'cancelled', 'void'],
        isActive: true,
      },
      {
        id: 'dim-003',
        tenantId: null,
        name: 'patient_gender',
        displayName: 'Patient Gender',
        displayNameAr: 'جنس المريض',
        description: 'Gender of the patient',
        columnRef: 'gender',
        database: 'clinical',
        baseTable: 'patients',
        dataType: 'string',
        allowedOperators: ['eq', 'in'],
        category: 'Demographics',
        isLookup: true,
        lookupValues: ['male', 'female', 'other'],
        isActive: true,
      },
      {
        id: 'dim-004',
        tenantId: null,
        name: 'encounter_date',
        displayName: 'Encounter Date',
        displayNameAr: 'تاريخ الزيارة',
        description: 'Date of the patient encounter',
        columnRef: 'encounter_date',
        database: 'clinical',
        baseTable: 'encounters',
        dataType: 'date',
        allowedOperators: ['eq', 'gte', 'lte', 'between'],
        category: 'Time',
        isLookup: false,
        isActive: true,
      },
      {
        id: 'dim-005',
        tenantId: null,
        name: 'encounter_type',
        displayName: 'Encounter Type',
        displayNameAr: 'نوع الزيارة',
        description: 'Type of patient encounter',
        columnRef: 'encounter_type',
        database: 'clinical',
        baseTable: 'encounters',
        dataType: 'string',
        allowedOperators: ['eq', 'in', 'not_in'],
        category: 'Classification',
        isLookup: true,
        lookupValues: ['outpatient', 'inpatient', 'emergency', 'telehealth'],
        isActive: true,
      },
      {
        id: 'dim-006',
        tenantId: null,
        name: 'facility_id',
        displayName: 'Facility',
        displayNameAr: 'المنشأة',
        description: 'Healthcare facility',
        columnRef: 'facility_id',
        database: 'clinical',
        baseTable: 'encounters',
        dataType: 'uuid',
        allowedOperators: ['eq', 'in'],
        category: 'Organization',
        isLookup: false,
        isActive: true,
      },
      {
        id: 'dim-007',
        tenantId: null,
        name: 'department_id',
        displayName: 'Department',
        displayNameAr: 'القسم',
        description: 'Hospital department',
        columnRef: 'department_id',
        database: 'clinical',
        baseTable: 'encounters',
        dataType: 'uuid',
        allowedOperators: ['eq', 'in'],
        category: 'Organization',
        isLookup: false,
        isActive: true,
      },
      {
        id: 'dim-008',
        tenantId: null,
        name: 'appointment_date',
        displayName: 'Appointment Date',
        displayNameAr: 'تاريخ الموعد',
        description: 'Scheduled appointment date',
        columnRef: 'appointment_date',
        database: 'clinical',
        baseTable: 'appointments',
        dataType: 'date',
        allowedOperators: ['eq', 'gte', 'lte', 'between'],
        category: 'Time',
        isLookup: false,
        isActive: true,
      },
      {
        id: 'dim-009',
        tenantId: null,
        name: 'appointment_status',
        displayName: 'Appointment Status',
        displayNameAr: 'حالة الموعد',
        description: 'Status of the appointment',
        columnRef: 'status',
        database: 'clinical',
        baseTable: 'appointments',
        dataType: 'string',
        allowedOperators: ['eq', 'in', 'not_in'],
        category: 'Status',
        isLookup: true,
        lookupValues: ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
        isActive: true,
      },
    ];
  }

  /**
   * Default join paths for initial implementation
   */
  private getDefaultJoinPaths(): SemanticJoinPath[] {
    return [
      {
        id: 'join-001',
        tenantId: null,
        name: 'encounters_to_patients',
        fromTable: 'encounters',
        fromDatabase: 'clinical',
        toTable: 'patients',
        toDatabase: 'clinical',
        joinType: 'inner',
        joinCondition: 'encounters.patient_id = patients.id',
        cardinality: 'many-to-one',
        isActive: true,
      },
      {
        id: 'join-002',
        tenantId: null,
        name: 'appointments_to_patients',
        fromTable: 'appointments',
        fromDatabase: 'clinical',
        toTable: 'patients',
        toDatabase: 'clinical',
        joinType: 'inner',
        joinCondition: 'appointments.patient_id = patients.id',
        cardinality: 'many-to-one',
        isActive: true,
      },
      {
        id: 'join-003',
        tenantId: null,
        name: 'invoices_to_encounters',
        fromTable: 'invoices',
        fromDatabase: 'rcm',
        toTable: 'encounters',
        toDatabase: 'clinical',
        joinType: 'left',
        joinCondition: 'invoices.encounter_id = encounters.id',
        cardinality: 'many-to-one',
        isActive: true,
      },
    ];
  }

  private formatCategoryName(name: string): string {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
