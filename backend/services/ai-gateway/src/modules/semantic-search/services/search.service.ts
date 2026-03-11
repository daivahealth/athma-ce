/**
 * Search Service
 * Handles semantic search over clinical documents using vector similarity
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { EmbeddingService } from './embedding.service';
import {
  SearchRequest,
  SearchResponse,
  SearchResult,
  SearchFilters,
  SEARCH_CONFIG,
  DocumentType,
} from '../types/search.types';
import { logger } from '../../../common/logger/logger.config';

@Injectable()
export class SearchService {
  constructor(
    private clinicalPrisma: ClinicalPrismaService,
    private embeddingService: EmbeddingService,
  ) {}

  /**
   * Perform semantic search over clinical documents
   */
  async search(
    request: SearchRequest,
    tenantId: string,
  ): Promise<SearchResponse> {
    const startTime = Date.now();

    // Step 1: Generate query embedding
    const queryEmbeddingStart = Date.now();
    const queryEmbedding = await this.embeddingService.embedText(request.query);
    const queryEmbeddingTime = Date.now() - queryEmbeddingStart;

    // Step 2: Build and execute search query
    const searchStart = Date.now();
    const limit = Math.min(
      request.limit || SEARCH_CONFIG.DEFAULT_LIMIT,
      SEARCH_CONFIG.MAX_LIMIT,
    );
    const minSimilarity = Math.max(
      request.minSimilarity || SEARCH_CONFIG.DEFAULT_MIN_SIMILARITY,
      SEARCH_CONFIG.MIN_SIMILARITY_THRESHOLD,
    );

    // Execute vector search with explicit + inferred filters.
    // If the user asks "female patients ..." in free text and no gender filter
    // is provided, infer patientGender to avoid cross-gender results.
    const effectiveFilters = this.applyInferredFilters(
      request.query,
      request.filters || {},
    );

    // Execute vector search with filters
    const results = await this.executeVectorSearch(
      queryEmbedding,
      tenantId,
      effectiveFilters,
      limit,
      minSimilarity,
    );

    const searchTime = Date.now() - searchStart;

    // Step 3: Highlight matching terms
    const highlightedResults = results.map((result) => ({
      ...result,
      highlightedText: this.highlightTerms(result.chunkText, request.query),
    }));

    logger.info(
      {
        tenantId,
        query: request.query,
        resultCount: results.length,
        queryEmbeddingTime,
        searchTime,
        totalTime: Date.now() - startTime,
      },
      'Search completed',
    );

    return {
      results: highlightedResults,
      totalCount: results.length,
      queryEmbeddingTime,
      searchTime,
      query: request.query,
    };
  }

  private applyInferredFilters(query: string, filters: SearchFilters): SearchFilters {
    const normalizedQuery = query.toLowerCase();
    const nextFilters: SearchFilters = { ...filters };

    // Respect explicit UI/API filters first.
    if (!nextFilters.patientGender) {
      const mentionsFemale =
        /\b(female|females|woman|women|girl|girls)\b/.test(normalizedQuery);
      const mentionsMale =
        /\b(male|males|man|men|boy|boys)\b/.test(normalizedQuery);

      // Apply only when intent is unambiguous.
      if (mentionsFemale && !mentionsMale) {
        nextFilters.patientGender = 'female';
      } else if (mentionsMale && !mentionsFemale) {
        nextFilters.patientGender = 'male';
      }
    }

    // Age-group inference from natural language.
    // Respect explicit age filters from UI/API.
    if (
      nextFilters.patientAgeMin === undefined &&
      nextFilters.patientAgeMax === undefined
    ) {
      const ageBuckets: Array<{
        key:
          | 'infant'
          | 'children'
          | 'teen'
          | 'adult'
          | 'middle_aged'
          | 'senior';
        pattern: RegExp;
        min?: number;
        max?: number;
      }> = [
        {
          key: 'infant',
          pattern: /\b(newborn|neonate|neonatal|infant|infants|baby|babies|toddler|toddlers)\b/,
          min: 0,
          max: 2,
        },
        {
          key: 'children',
          pattern: /\b(child|children|kid|kids|pediatric|paediatric|school-age)\b/,
          min: 3,
          max: 12,
        },
        {
          key: 'teen',
          pattern: /\b(teen|teens|teenager|teenagers|adolescent|adolescents)\b/,
          min: 13,
          max: 19,
        },
        {
          key: 'adult',
          pattern: /\b(adult|adults)\b/,
          min: 20,
          max: 64,
        },
        {
          key: 'middle_aged',
          pattern: /\b(middle-aged|middle aged)\b/,
          min: 45,
          max: 64,
        },
        {
          key: 'senior',
          pattern: /\b(senior|seniors|senior citizen|senior citizens|elderly|geriatric|older adult|older adults)\b/,
          min: 65,
        },
      ];

      const matched = ageBuckets.filter((bucket) => bucket.pattern.test(normalizedQuery));
      if (matched.length === 1) {
        const [bucket] = matched;
        nextFilters.patientAgeMin = bucket.min;
        nextFilters.patientAgeMax = bucket.max;
      }
    }

    return nextFilters;
  }

  /**
   * Find documents similar to a given document
   */
  async findSimilarDocuments(
    documentId: string,
    documentType: DocumentType,
    tenantId: string,
    limit: number = 5,
    minSimilarity: number = 0.8,
  ): Promise<SearchResult[]> {
    // Get the embedding of the source document (first chunk)
    const sourceEmbedding = await this.getDocumentEmbedding(
      documentId,
      documentType,
      tenantId,
    );

    if (!sourceEmbedding) {
      throw new NotFoundException(
        `Document embedding not found: ${documentType}/${documentId}`,
      );
    }

    // Search for similar documents, excluding the source
    const results = await this.executeVectorSearch(
      sourceEmbedding,
      tenantId,
      {},
      limit + 1, // Extra to account for self-match
      minSimilarity,
    );

    // Filter out the source document
    return results.filter((r) => r.documentId !== documentId).slice(0, limit);
  }

  /**
   * Execute the vector search query against pgvector
   * Note: This is a placeholder that simulates the search until pgvector is set up
   */
  private async executeVectorSearch(
    queryEmbedding: number[],
    tenantId: string,
    filters: SearchFilters,
    limit: number,
    minSimilarity: number,
  ): Promise<SearchResult[]> {
    // Build the filter conditions
    // Note: UUID columns require explicit casting for Prisma $queryRawUnsafe
    const filterConditions: string[] = ['tenant_id = $1::uuid', 'is_active = true'];
    const params: any[] = [tenantId];
    let paramIndex = 2;

    // Embedding as array literal for pgvector
    const embeddingLiteral = `'[${queryEmbedding.join(',')}]'::vector`;

    if (filters.patientId) {
      filterConditions.push(`patient_id = $${paramIndex++}::uuid`);
      params.push(filters.patientId);
    }

    if (filters.encounterId) {
      filterConditions.push(`encounter_id = $${paramIndex++}::uuid`);
      params.push(filters.encounterId);
    }

    if (filters.facilityId) {
      filterConditions.push(`facility_id = $${paramIndex++}::uuid`);
      params.push(filters.facilityId);
    }

    if (filters.departmentId) {
      filterConditions.push(`department_id = $${paramIndex++}::uuid`);
      params.push(filters.departmentId);
    }

    if (filters.specialtyCode) {
      filterConditions.push(`specialty_code = $${paramIndex++}`);
      params.push(filters.specialtyCode);
    }

    if (filters.documentTypes && filters.documentTypes.length > 0) {
      filterConditions.push(`document_type = ANY($${paramIndex++})`);
      params.push(filters.documentTypes);
    }

    if (filters.dateFrom) {
      filterConditions.push(`document_date >= $${paramIndex++}`);
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      filterConditions.push(`document_date <= $${paramIndex++}`);
      params.push(filters.dateTo);
    }

    // New denormalized filters
    if (filters.patientName) {
      filterConditions.push(`patient_name ILIKE $${paramIndex++}`);
      params.push(`%${filters.patientName}%`);
    }

    if (filters.patientMrn) {
      filterConditions.push(`patient_mrn ILIKE $${paramIndex++}`);
      params.push(`${filters.patientMrn}%`);
    }

    if (filters.patientGender) {
      filterConditions.push(`patient_gender = $${paramIndex++}`);
      params.push(filters.patientGender);
    }

    if (filters.patientAgeMin !== undefined) {
      filterConditions.push(`patient_age_at_doc >= $${paramIndex++}`);
      params.push(filters.patientAgeMin);
    }

    if (filters.patientAgeMax !== undefined) {
      filterConditions.push(`patient_age_at_doc <= $${paramIndex++}`);
      params.push(filters.patientAgeMax);
    }

    if (filters.encounterType) {
      filterConditions.push(`encounter_type = $${paramIndex++}`);
      params.push(filters.encounterType);
    }

    if (filters.authorStaffId) {
      filterConditions.push(`author_staff_id = $${paramIndex++}::uuid`);
      params.push(filters.authorStaffId);
    }

    if (filters.authorName) {
      filterConditions.push(`author_name ILIKE $${paramIndex++}`);
      params.push(`%${filters.authorName}%`);
    }

    // Similarity threshold
    filterConditions.push(`1 - (embedding <=> ${embeddingLiteral}) >= $${paramIndex++}`);
    params.push(minSimilarity);

    params.push(limit);

    const sql = `
      SELECT
        document_id,
        document_type,
        patient_id,
        encounter_id,
        facility_id,
        department_id,
        chunk_text,
        document_date,
        patient_name,
        patient_mrn,
        patient_gender,
        patient_age_at_doc,
        encounter_number,
        encounter_type,
        author_staff_id,
        author_name,
        department_name,
        facility_name,
        1 - (embedding <=> ${embeddingLiteral}) AS similarity
      FROM clinical_document_embeddings
      WHERE ${filterConditions.join(' AND ')}
      ORDER BY embedding <=> ${embeddingLiteral}
      LIMIT $${paramIndex}
    `;

    try {
      const rows = await this.clinicalPrisma.$queryRawUnsafe(sql, ...params);
      return (rows as any[]).map((row) => ({
        documentId: row.document_id,
        documentType: row.document_type as DocumentType,
        patientId: row.patient_id,
        encounterId: row.encounter_id,
        facilityId: row.facility_id,
        departmentId: row.department_id,
        chunkText: row.chunk_text,
        highlightedText: '',
        similarity: parseFloat(row.similarity),
        documentDate: row.document_date,
        // Denormalized fields
        patientName: row.patient_name,
        patientMrn: row.patient_mrn,
        patientGender: row.patient_gender,
        patientAge: row.patient_age_at_doc,
        encounterNumber: row.encounter_number,
        encounterType: row.encounter_type,
        authorStaffId: row.author_staff_id,
        authorName: row.author_name,
        departmentName: row.department_name,
        facilityName: row.facility_name,
      }));
    } catch (error) {
      // If the table doesn't exist yet, return empty results
      // This allows the service to start before the schema is fully deployed
      logger.warn(
        { error },
        'Vector search failed - table may not exist yet',
      );
      return [];
    }
  }

  /**
   * Get the embedding for a document
   */
  private async getDocumentEmbedding(
    documentId: string,
    documentType: DocumentType,
    tenantId: string,
  ): Promise<number[] | null> {
    try {
      const result = await this.clinicalPrisma.$queryRaw<any[]>`
        SELECT embedding
        FROM clinical_document_embeddings
        WHERE tenant_id = ${tenantId}::uuid
          AND document_id = ${documentId}::uuid
          AND document_type = ${documentType}
          AND chunk_index = 0
          AND is_active = true
        LIMIT 1
      `;

      if (result.length === 0) {
        return null;
      }

      return result[0].embedding;
    } catch (error) {
      logger.warn({ error }, 'Failed to get document embedding');
      return null;
    }
  }

  /**
   * Highlight search terms in the text
   */
  private highlightTerms(text: string, query: string): string {
    // Extract meaningful words from query (skip common words)
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
      'patient', 'patients', 'find', 'show', 'get', 'all', 'any',
    ]);

    const queryWords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    if (queryWords.length === 0) {
      return text;
    }

    // Create regex pattern for all query words
    const pattern = queryWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Replace matches with highlighted version (using markdown bold)
    return text.replace(regex, '**$1**');
  }
}
