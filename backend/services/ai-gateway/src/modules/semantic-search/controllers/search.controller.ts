/**
 * Semantic Search Controller
 * Handles clinical document search requests
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { SearchService } from '../services/search.service';
import { EmbeddingSyncService } from '../services/embedding-sync.service';
import { ReindexService, ReindexMode } from '../services/reindex.service';
import { EmbeddingService } from '../services/embedding.service';
import {
  SearchRequestDto,
  SimilarDocumentsRequestDto,
  QueueEmbeddingDto,
  ReindexRequestDto,
  SearchResponseDto,
  SearchResultDto,
  EmbeddingStatsDto,
} from '../dto/search.dto';
import {
  Context,
  TenantId,
} from '../../../common/decorators/tenant-context.decorator';
import { TenantRequestContext } from '../../../common/middleware/tenant-context.middleware';
import { SearchFilters, DocumentType, EMBEDDING_CONFIG } from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

@ApiTags('Semantic Search')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-tenant-id')
@ApiSecurity('x-user-id')
@ApiSecurity('x-facility-id')
@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private embeddingSyncService: EmbeddingSyncService,
    private reindexService: ReindexService,
    private embeddingService: EmbeddingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search clinical documents',
    description:
      'Performs semantic search over clinical notes and documents using vector similarity',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
    type: SearchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid search request' })
  async search(
    @Body() dto: SearchRequestDto,
    @Context() context: TenantRequestContext,
  ): Promise<SearchResponseDto> {
    const filters: SearchFilters = {
      // ID-based filters
      patientId: dto.patientId,
      encounterId: dto.encounterId,
      facilityId: dto.facilityId,
      departmentId: dto.departmentId,
      specialtyCode: dto.specialtyCode,
      documentTypes: dto.documentTypes as DocumentType[],
      dateFrom: dto.dateFrom ? new Date(dto.dateFrom) : undefined,
      dateTo: dto.dateTo ? new Date(dto.dateTo) : undefined,
      // Name-based filters (denormalized)
      patientName: dto.patientName,
      patientMrn: dto.patientMrn,
      patientGender: dto.patientGender,
      patientAgeMin: dto.patientAgeMin,
      patientAgeMax: dto.patientAgeMax,
      encounterType: dto.encounterType,
      authorStaffId: dto.authorStaffId,
      authorName: dto.authorName,
    };

    const response = await this.searchService.search(
      {
        query: dto.query,
        filters,
        limit: dto.limit,
        minSimilarity: dto.minSimilarity,
      },
      context.tenantId,
    );

    return response;
  }

  @Post('similar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find similar documents',
    description: 'Find documents similar to a given document based on semantic similarity',
  })
  @ApiResponse({
    status: 200,
    description: 'Similar documents',
    type: [SearchResultDto],
  })
  async findSimilar(
    @Body() dto: SimilarDocumentsRequestDto,
    @Context() context: TenantRequestContext,
  ): Promise<SearchResultDto[]> {
    const results = await this.searchService.findSimilarDocuments(
      dto.documentId,
      dto.documentType as DocumentType,
      context.tenantId,
      dto.limit,
      dto.minSimilarity,
    );

    return results;
  }

  @Post('embed')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Queue a document for embedding',
    description: 'Queues a clinical document to be processed and embedded for search',
  })
  @ApiResponse({
    status: 202,
    description: 'Document queued for embedding',
  })
  async queueForEmbedding(
    @Body() dto: QueueEmbeddingDto,
    @Context() context: TenantRequestContext,
  ): Promise<{ message: string }> {
    await this.embeddingSyncService.queueForEmbedding(
      context.tenantId,
      dto.documentType as DocumentType,
      dto.documentId,
    );

    return {
      message: `Document ${dto.documentId} queued for embedding`,
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get embedding statistics',
    description: 'Returns statistics about embedded documents and pending jobs',
  })
  @ApiResponse({
    status: 200,
    description: 'Embedding statistics',
    type: EmbeddingStatsDto,
  })
  async getStats(
    @Context() context: TenantRequestContext,
  ): Promise<EmbeddingStatsDto> {
    const stats = await this.embeddingSyncService.getStats(context.tenantId);

    return {
      ...stats,
      lastSyncAt: stats.lastSyncAt ?? undefined,
      embeddingModel: EMBEDDING_CONFIG.MODEL,
    };
  }

  @Post('reindex')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Start a reindex job',
    description: 'Initiates bulk reindexing. Modes: full (re-index all), new_only (only docs without embeddings), metadata_only (update metadata for existing embeddings)',
  })
  @ApiResponse({
    status: 202,
    description: 'Reindex job started',
  })
  async startReindex(
    @Body() dto: ReindexRequestDto,
    @Context() context: TenantRequestContext,
  ): Promise<{ jobId: string; message: string }> {
    const mode = (dto.mode || 'full') as ReindexMode;

    logger.info(
      {
        tenantId: context.tenantId,
        documentTypes: dto.documentTypes,
        fromDate: dto.fromDate,
        mode,
      },
      'Reindex requested',
    );

    return this.reindexService.startReindex(
      context.tenantId,
      dto.documentTypes as DocumentType[],
      dto.fromDate ? new Date(dto.fromDate) : undefined,
      mode,
    );
  }

  @Get('reindex/status')
  @ApiOperation({
    summary: 'Get reindex job status',
    description: 'Returns the progress of the current reindex job',
  })
  @ApiResponse({
    status: 200,
    description: 'Reindex progress',
  })
  async getReindexStatus(
    @Context() context: TenantRequestContext,
  ): Promise<any> {
    const progress = this.reindexService.getProgress(context.tenantId);

    if (!progress) {
      return { status: 'no_active_job', message: 'No reindex job is currently running' };
    }

    return progress;
  }

  @Post('reindex/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel reindex job',
    description: 'Cancels the currently running reindex job',
  })
  @ApiResponse({
    status: 200,
    description: 'Reindex job cancelled',
  })
  async cancelReindex(
    @Context() context: TenantRequestContext,
  ): Promise<{ success: boolean; message: string }> {
    const cancelled = this.reindexService.cancelReindex(context.tenantId);

    return {
      success: cancelled,
      message: cancelled
        ? 'Reindex job cancellation requested'
        : 'No active reindex job to cancel',
    };
  }

  @Get('model-info')
  @ApiOperation({
    summary: 'Get embedding model info',
    description: 'Returns information about the embedding model being used',
  })
  @ApiResponse({
    status: 200,
    description: 'Model information',
  })
  async getModelInfo(): Promise<{ model: string; dimensions: number }> {
    return this.embeddingService.getModelInfo();
  }
}
