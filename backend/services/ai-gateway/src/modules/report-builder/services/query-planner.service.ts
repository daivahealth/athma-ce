/**
 * Query Planner Service
 * Converts natural language queries to structured JSON query plans using LLM
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { LLMClientService } from '../../../shared/llm-client/llm-client.service';
import { CatalogService } from './catalog.service';
import {
  QueryPlan,
  QueryPlanWithMetadata,
  SECURITY_RULES,
} from '../types/query-plan.types';
import { CatalogSummary } from '../types/catalog.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class QueryPlannerService {
  constructor(
    private llmClient: LLMClientService,
    private catalogService: CatalogService,
  ) {}

  /**
   * Convert a natural language query to a structured query plan
   */
  async generatePlan(
    query: string,
    tenantId: string,
    userPermissions: string[],
  ): Promise<QueryPlanWithMetadata> {
    // Get catalog context for the LLM
    const catalogSummary = await this.catalogService.getCatalogSummary(
      tenantId,
      userPermissions,
    );

    // Build the prompt
    const systemPrompt = this.buildSystemPrompt(catalogSummary);
    const userPrompt = this.buildUserPrompt(query);

    // Call LLM to generate plan
    const response = await this.llmClient.completion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0,
      maxTokens: 2048,
    });

    // Parse the response
    const planWithMetadata = this.parseResponse(response.content, query);

    // Validate the plan
    this.validatePlan(planWithMetadata.plan, catalogSummary);

    logger.info(
      {
        query,
        tenantId,
        planType: planWithMetadata.plan.type,
        metricsCount: planWithMetadata.plan.metrics.length,
        dimensionsCount: planWithMetadata.plan.dimensions.length,
        filtersCount: planWithMetadata.plan.filters.length,
        confidence: planWithMetadata.confidence,
      },
      'Query plan generated',
    );

    return planWithMetadata;
  }

  /**
   * Validate a query without generating results
   */
  async validateQuery(
    query: string,
    tenantId: string,
    userPermissions: string[],
  ): Promise<{ isValid: boolean; errors: string[]; suggestions: string[] }> {
    try {
      const planWithMetadata = await this.generatePlan(query, tenantId, userPermissions);
      return {
        isValid: true,
        errors: [],
        suggestions: planWithMetadata.suggestedFollowups || [],
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        suggestions: [
          'Try asking for specific metrics like "total revenue" or "patient count"',
          'Specify a time period like "this month" or "last 30 days"',
          'Include grouping dimensions like "by department" or "by status"',
        ],
      };
    }
  }

  /**
   * Build the system prompt with catalog context
   */
  private buildSystemPrompt(catalog: CatalogSummary): string {
    const metricsDescription = catalog.metricCategories
      .map(
        (cat) =>
          `## ${cat.displayName}\n` +
          cat.metrics
            .map((m) => `- ${m.name}: ${m.description} (${m.displayName})`)
            .join('\n'),
      )
      .join('\n\n');

    const dimensionsDescription = catalog.dimensionCategories
      .map(
        (cat) =>
          `## ${cat.displayName}\n` +
          cat.dimensions
            .map((d) => `- ${d.name}: ${d.description} (${d.displayName})`)
            .join('\n'),
      )
      .join('\n\n');

    return `You are a healthcare report query planner. Your job is to convert natural language questions into structured JSON query plans.

AVAILABLE METRICS (what can be measured):
${metricsDescription}

AVAILABLE DIMENSIONS (what can be grouped/filtered by):
${dimensionsDescription}

RULES:
1. Output ONLY valid JSON - no explanation, no markdown, no code blocks
2. Use ONLY metrics and dimensions from the lists above
3. For date filters, use ISO 8601 format (YYYY-MM-DD)
4. "today" means the current date
5. "this month" means from the first day of the current month to today
6. "last 30 days" means from 30 days ago to today
7. Default limit is 1000, maximum is 10000
8. Confidence should be between 0 and 1

QUERY PLAN SCHEMA:
{
  "plan": {
    "type": "aggregate" | "list" | "detail",
    "metrics": [{ "name": string, "aggregation"?: "SUM"|"COUNT"|"AVG"|"MIN"|"MAX"|"COUNT_DISTINCT", "alias"?: string }],
    "dimensions": [{ "name": string, "alias"?: string }],
    "filters": [{ "dimension": string, "operator": "eq"|"ne"|"gt"|"gte"|"lt"|"lte"|"in"|"not_in"|"contains"|"starts_with"|"between", "value": any, "valueTo"?: any }],
    "orderBy": [{ "field": string, "direction": "asc"|"desc" }],
    "limit": number,
    "offset"?: number
  },
  "confidence": number,
  "suggestedFollowups": [string]
}

EXAMPLES:

Query: "What is today's revenue?"
{
  "plan": {
    "type": "aggregate",
    "metrics": [{ "name": "total_revenue", "aggregation": "SUM" }],
    "dimensions": [],
    "filters": [{ "dimension": "invoice_date", "operator": "eq", "value": "TODAY" }],
    "orderBy": [],
    "limit": 1
  },
  "confidence": 0.95,
  "suggestedFollowups": ["Revenue by department today?", "Compare with yesterday?"]
}

Query: "Show me patients by gender"
{
  "plan": {
    "type": "aggregate",
    "metrics": [{ "name": "patient_count", "aggregation": "COUNT_DISTINCT" }],
    "dimensions": [{ "name": "patient_gender" }],
    "filters": [],
    "orderBy": [{ "field": "patient_count", "direction": "desc" }],
    "limit": 1000
  },
  "confidence": 0.9,
  "suggestedFollowups": ["Patient count by age group?", "Male vs female trends?"]
}`;
  }

  /**
   * Build the user prompt
   */
  private buildUserPrompt(query: string): string {
    const today = new Date().toISOString().split('T')[0];
    return `Today's date is ${today}. Convert this query to a JSON plan:\n\n"${query}"`;
  }

  /**
   * Parse the LLM response into a query plan
   */
  private parseResponse(response: string, originalQuery: string): QueryPlanWithMetadata {
    // Clean up the response - remove any markdown code blocks
    let cleanResponse = response.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.slice(7);
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.slice(3);
    }
    if (cleanResponse.endsWith('```')) {
      cleanResponse = cleanResponse.slice(0, -3);
    }
    cleanResponse = cleanResponse.trim();

    try {
      const parsed = JSON.parse(cleanResponse);

      // Handle both direct plan and wrapped plan formats
      const plan: QueryPlan = parsed.plan || parsed;
      const confidence = parsed.confidence || 0.8;
      const suggestedFollowups = parsed.suggestedFollowups || [];

      // Apply defaults
      plan.limit = Math.min(plan.limit || 1000, SECURITY_RULES.MAX_ROW_LIMIT);
      plan.offset = plan.offset || 0;
      plan.type = plan.type || 'aggregate';
      plan.metrics = plan.metrics || [];
      plan.dimensions = plan.dimensions || [];
      plan.filters = plan.filters || [];
      plan.orderBy = plan.orderBy || [];

      return {
        plan,
        originalQuery,
        confidence,
        suggestedFollowups,
      };
    } catch (error) {
      logger.error({ response, error }, 'Failed to parse LLM response');
      throw new BadRequestException(
        'Failed to understand the query. Please try rephrasing.',
      );
    }
  }

  /**
   * Validate the query plan against the catalog and security rules
   */
  private validatePlan(plan: QueryPlan, catalog: CatalogSummary): void {
    const errors: string[] = [];

    // Validate metrics exist in catalog
    const availableMetrics = new Set(
      catalog.metricCategories.flatMap((c) => c.metrics.map((m) => m.name)),
    );
    for (const metric of plan.metrics) {
      if (!availableMetrics.has(metric.name)) {
        errors.push(`Unknown metric: ${metric.name}`);
      }
      if (metric.aggregation && !SECURITY_RULES.ALLOWED_AGGREGATIONS.includes(metric.aggregation)) {
        errors.push(`Invalid aggregation: ${metric.aggregation}`);
      }
    }

    // Validate dimensions exist in catalog
    const availableDimensions = new Set(
      catalog.dimensionCategories.flatMap((c) => c.dimensions.map((d) => d.name)),
    );
    for (const dimension of plan.dimensions) {
      if (!availableDimensions.has(dimension.name)) {
        errors.push(`Unknown dimension: ${dimension.name}`);
      }
    }

    // Validate filter dimensions
    for (const filter of plan.filters) {
      if (!availableDimensions.has(filter.dimension)) {
        errors.push(`Unknown filter dimension: ${filter.dimension}`);
      }
      if (!SECURITY_RULES.ALLOWED_OPERATORS.includes(filter.operator)) {
        errors.push(`Invalid operator: ${filter.operator}`);
      }
    }

    // Validate limit
    if (plan.limit > SECURITY_RULES.MAX_ROW_LIMIT) {
      errors.push(`Limit exceeds maximum (${SECURITY_RULES.MAX_ROW_LIMIT})`);
    }

    // Check for SQL injection patterns in string values
    for (const filter of plan.filters) {
      if (typeof filter.value === 'string') {
        for (const pattern of SECURITY_RULES.FORBIDDEN_PATTERNS) {
          if (pattern.test(filter.value)) {
            errors.push('Potentially unsafe filter value detected');
            break;
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(`Invalid query plan: ${errors.join('; ')}`);
    }
  }
}
