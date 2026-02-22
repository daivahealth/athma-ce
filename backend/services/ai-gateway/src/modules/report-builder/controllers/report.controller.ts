/**
 * Report Builder Controller
 * Handles natural language report generation requests
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { QueryPlannerService } from '../services/query-planner.service';
import { SqlCompilerService } from '../services/sql-compiler.service';
import { QueryExecutorService } from '../services/query-executor.service';
import { ExportService } from '../services/export.service';
import { CatalogService } from '../services/catalog.service';
import {
  GenerateReportDto,
  ValidateQueryDto,
  QueryPlanResponseDto,
  ReportResultDto,
  CatalogSummaryDto,
  ExportFormat,
} from '../dto/report.dto';
import {
  Context,
  TenantId,
} from '../../../common/decorators/tenant-context.decorator';
import { TenantRequestContext } from '../../../common/middleware/tenant-context.middleware';
import { logger } from '../../../common/logger/logger.config';

@ApiTags('Report Builder')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-tenant-id')
@ApiSecurity('x-user-id')
@ApiSecurity('x-facility-id')
@Controller('reports')
export class ReportController {
  constructor(
    private queryPlannerService: QueryPlannerService,
    private sqlCompilerService: SqlCompilerService,
    private queryExecutorService: QueryExecutorService,
    private exportService: ExportService,
    private catalogService: CatalogService,
  ) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a report from natural language query',
    description:
      'Converts a natural language query into SQL and executes it against the appropriate database',
  })
  @ApiResponse({
    status: 200,
    description: 'Report generated successfully',
    type: ReportResultDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid query' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateReport(
    @Body() dto: GenerateReportDto,
    @Context() context: TenantRequestContext,
    @Res() res: Response,
  ) {
    const startTime = Date.now();

    logger.info(
      {
        tenantId: context.tenantId,
        userId: context.userId,
        query: dto.query,
        format: dto.format,
      },
      'Report generation started',
    );

    // Step 1: Generate query plan from natural language
    const planWithMetadata = await this.queryPlannerService.generatePlan(
      dto.query,
      context.tenantId,
      context.permissions || [],
    );

    // Apply limit and offset overrides
    if (dto.limit) {
      planWithMetadata.plan.limit = dto.limit;
    }
    if (dto.offset) {
      planWithMetadata.plan.offset = dto.offset;
    }

    // Step 2: Compile to SQL
    const compiled = await this.sqlCompilerService.compile(
      planWithMetadata.plan,
      context.tenantId,
    );

    // Step 3: Execute query
    const result = await this.queryExecutorService.execute(
      compiled,
      planWithMetadata.plan,
    );

    // Include SQL in debug mode
    if (dto.debug) {
      result.sql = compiled.sql;
    }

    // Step 4: Export if requested
    if (dto.format && dto.format !== ExportFormat.JSON) {
      const exportOptions = {
        title: dto.query.slice(0, 50),
        includeTimestamp: true,
        currency: dto.currency || 'INR',
        locale: dto.locale,
      };

      let buffer: Buffer;
      let contentType: string;
      let filename: string;

      switch (dto.format) {
        case ExportFormat.EXCEL:
          buffer = await this.exportService.exportToExcel(result, exportOptions);
          contentType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `report-${Date.now()}.xlsx`;
          break;

        case ExportFormat.CSV:
          buffer = await this.exportService.exportToCsv(result, exportOptions);
          contentType = 'text/csv';
          filename = `report-${Date.now()}.csv`;
          break;

        case ExportFormat.PDF:
          buffer = await this.exportService.exportToPdf(result, exportOptions);
          contentType = 'application/pdf';
          filename = `report-${Date.now()}.pdf`;
          break;

        default:
          return res.status(HttpStatus.OK).json(result);
      }

      logger.info(
        {
          format: dto.format,
          bufferSize: buffer.length,
          totalTimeMs: Date.now() - startTime,
        },
        'Report exported',
      );

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(buffer);
    }

    logger.info(
      {
        rowCount: result.totalCount,
        totalTimeMs: Date.now() - startTime,
      },
      'Report generated',
    );

    return res.status(HttpStatus.OK).json(result);
  }

  @Post('validate')
  @ApiOperation({
    summary: 'Validate a natural language query',
    description:
      'Checks if a query can be converted to a valid report without executing it',
  })
  @ApiResponse({
    status: 200,
    description: 'Validation result',
    type: QueryPlanResponseDto,
  })
  async validateQuery(
    @Body() dto: ValidateQueryDto,
    @Context() context: TenantRequestContext,
  ): Promise<QueryPlanResponseDto> {
    const validation = await this.queryPlannerService.validateQuery(
      dto.query,
      context.tenantId,
      context.permissions || [],
    );

    return {
      isValid: validation.isValid,
      confidence: validation.isValid ? 0.9 : 0,
      errors: validation.errors,
      suggestions: validation.suggestions,
    };
  }

  @Get('catalog')
  @ApiOperation({
    summary: 'Get available metrics and dimensions',
    description:
      'Returns the semantic catalog filtered by user permissions, showing what can be queried',
  })
  @ApiResponse({
    status: 200,
    description: 'Catalog summary',
    type: CatalogSummaryDto,
  })
  async getCatalog(
    @Context() context: TenantRequestContext,
  ): Promise<CatalogSummaryDto> {
    const summary = await this.catalogService.getCatalogSummary(
      context.tenantId,
      context.permissions || [],
    );

    return {
      metricCategories: summary.metricCategories.map((cat) => ({
        name: cat.name,
        displayName: cat.displayName,
        metrics: cat.metrics.map((m) => ({
          name: m.name,
          displayName: m.displayName,
          description: m.description,
        })),
      })),
      dimensionCategories: summary.dimensionCategories.map((cat) => ({
        name: cat.name,
        displayName: cat.displayName,
        dimensions: cat.dimensions.map((d) => ({
          name: d.name,
          displayName: d.displayName,
          description: d.description,
        })),
      })),
      availableJoins: summary.availableJoins,
    };
  }

  @Get('examples')
  @ApiOperation({
    summary: 'Get example queries',
    description: 'Returns example natural language queries for the report builder',
  })
  @ApiResponse({ status: 200, description: 'Example queries' })
  async getExamples(): Promise<{ examples: { query: string; description: string }[] }> {
    return {
      examples: [
        {
          query: "What is today's total revenue?",
          description: 'Sum of all invoice amounts for today',
        },
        {
          query: 'Show me patient count by gender',
          description: 'Count of patients grouped by gender',
        },
        {
          query: 'Revenue by invoice status this month',
          description: 'Sum of revenue grouped by invoice status for current month',
        },
        {
          query: 'How many appointments were scheduled today?',
          description: "Count of today's appointments",
        },
        {
          query: 'Show encounters by type for last 30 days',
          description: 'Encounter count grouped by type for past month',
        },
        {
          query: 'What is the outstanding balance?',
          description: 'Sum of all unpaid invoice balances',
        },
      ],
    };
  }
}
