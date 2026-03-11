/**
 * Clinical Coding Service
 * Orchestrates AI-powered ICD-10 and SNOMED code suggestions from clinical text.
 *
 * Flow: sanitize → cache check → LLM call → catalog validate → return
 */

import { Injectable } from '@nestjs/common';
import { PrismaService as ClinicalPrismaService } from '@zeal/database-clinical';
import { PrismaService as FoundationPrismaService } from '@zeal/database-foundation';
import { LLMClientService } from '../../../shared/llm-client/llm-client.service';
import { PhiSanitizerService } from './phi-sanitizer.service';
import { CodingCacheService } from './coding-cache.service';
import {
  ClinicalCodingSuggestDto,
  ClinicalCodingSuggestion,
  ClinicalCodingSuggestResponseDto,
} from '../dto/clinical-coding.dto';
import { logger } from '../../../common/logger/logger.config';

/** Shape the LLM is expected to return per suggestion */
interface RawLLMSuggestion {
  code: string;
  description: string;
  shortDescription?: string;
  confidence: number;
  codeSystem: 'ICD-10' | 'SNOMED';
  rationale: string;
}

@Injectable()
export class ClinicalCodingService {
  constructor(
    private llmClient: LLMClientService,
    private phiSanitizer: PhiSanitizerService,
    private codingCache: CodingCacheService,
    private clinicalPrisma: ClinicalPrismaService,
    private foundationPrisma: FoundationPrismaService,
  ) {}

  /**
   * Generate coding suggestions for clinical text.
   */
  async suggest(
    dto: ClinicalCodingSuggestDto,
    tenantId: string,
    facilityId: string,
  ): Promise<ClinicalCodingSuggestResponseDto> {
    const startTime = Date.now();

    // 1. Defense-in-depth PHI sanitization
    const { sanitizedText, phiDetected } = this.phiSanitizer.sanitize(dto.clinicalText);
    if (phiDetected) {
      logger.warn({ tenantId }, 'PHI detected in clinical coding request - redacted before LLM call');
    }

    // 2. Resolve config: max suggestions
    const maxSuggestions = await this.resolveConfigNumber(
      tenantId,
      facilityId,
      'ai.clinical_coding.max_suggestions',
      10,
    );

    // 3. Check cache
    const cached = await this.codingCache.get(tenantId, sanitizedText);
    if (cached) {
      const filtered = this.filterExistingCodes(cached, dto.existingCodes);
      return {
        suggestions: filtered.slice(0, maxSuggestions),
        fromCache: true,
        processingTimeMs: Date.now() - startTime,
      };
    }

    // 4. Call LLM
    const rawSuggestions = await this.callLLM(sanitizedText, dto.blockTypes, maxSuggestions);

    // 5. Validate against catalog (ICD-10 codes)
    const enriched = await this.enrichFromCatalog(rawSuggestions, tenantId);

    // 6. Cache the full result (before filtering existing codes)
    await this.codingCache.set(tenantId, sanitizedText, enriched);

    // 7. Filter out codes already on the encounter
    const filtered = this.filterExistingCodes(enriched, dto.existingCodes);

    return {
      suggestions: filtered.slice(0, maxSuggestions),
      fromCache: false,
      processingTimeMs: Date.now() - startTime,
    };
  }

  // ─── Private helpers ───────────────────────────────────────

  private async callLLM(
    text: string,
    blockTypes?: string[],
    maxSuggestions = 10,
  ): Promise<RawLLMSuggestion[]> {
    const systemPrompt = this.buildSystemPrompt(maxSuggestions);
    const userPrompt = this.buildUserPrompt(text, blockTypes);

    const response = await this.llmClient.completion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      maxTokens: 2000,
    });

    return this.parseResponse(response.content);
  }

  private buildSystemPrompt(maxSuggestions: number): string {
    return `You are a medical coding specialist. Your task is to analyze de-identified clinical text and suggest applicable ICD-10-CM and SNOMED-CT codes.

RULES:
1. Output ONLY a valid JSON array — no markdown, no explanation, no code fences.
2. Each element must have: code, description, shortDescription, confidence (0.0–1.0), codeSystem ("ICD-10" or "SNOMED"), rationale.
3. Suggest codes at the highest specificity available.
4. Order by confidence descending.
5. Return at most ${maxSuggestions} suggestions total, with a mix of ICD-10 and SNOMED codes.
6. For ICD-10, use ICD-10-CM codes (e.g., E11.9, I10, J06.9).
7. For SNOMED, use SNOMED-CT concept IDs (e.g., 73211009, 38341003).
8. Never include any patient-identifiable information in your response.
9. If the clinical text is too vague to assign codes confidently, return an empty array [].

EXAMPLE OUTPUT:
[
  {"code":"E11.9","description":"Type 2 diabetes mellitus without complications","shortDescription":"Type 2 DM","confidence":0.95,"codeSystem":"ICD-10","rationale":"Patient described as diabetic"},
  {"code":"73211009","description":"Diabetes mellitus (disorder)","shortDescription":"Diabetes mellitus","confidence":0.90,"codeSystem":"SNOMED","rationale":"SNOMED equivalent for diabetes"}
]`;
  }

  private buildUserPrompt(text: string, blockTypes?: string[]): string {
    const context = blockTypes?.length
      ? `Clinical sections: ${blockTypes.join(', ')}.\n\n`
      : '';
    return `${context}Analyze this clinical text and suggest relevant ICD-10-CM and SNOMED-CT codes:\n\n${text}`;
  }

  private parseResponse(content: string): RawLLMSuggestion[] {
    let clean = content.trim();
    // Strip markdown code fences if present
    if (clean.startsWith('```json')) clean = clean.slice(7);
    else if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    clean = clean.trim();

    try {
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed)) {
        logger.error({ content }, 'LLM response is not an array');
        return [];
      }
      return parsed.filter(
        (s: any) => s.code && s.description && s.codeSystem && typeof s.confidence === 'number',
      );
    } catch (err) {
      logger.error({ content, err }, 'Failed to parse LLM clinical coding response');
      return [];
    }
  }

  /**
   * Look up ICD-10 suggestions in DiagnosisMaster to validate and enrich.
   */
  private async enrichFromCatalog(
    raw: RawLLMSuggestion[],
    tenantId: string,
  ): Promise<ClinicalCodingSuggestion[]> {
    const icdCodes = raw.filter((s) => s.codeSystem === 'ICD-10').map((s) => s.code);

    // Batch look up ICD codes from the catalog
    let catalogMap = new Map<string, { description: string; shortDescription: string | null; isBillable: boolean }>();
    if (icdCodes.length > 0) {
      const catalogEntries = await this.clinicalPrisma.diagnosisMaster.findMany({
        where: {
          code: { in: icdCodes },
          isActive: true,
          // Include both tenant-specific and global entries
          OR: [{ tenantId }, { tenantId: null }],
        },
        select: {
          code: true,
          description: true,
          shortDescription: true,
          isBillable: true,
        },
      });
      for (const entry of catalogEntries) {
        catalogMap.set(entry.code, {
          description: entry.description,
          shortDescription: entry.shortDescription,
          isBillable: entry.isBillable,
        });
      }
    }

    return raw.map((s) => {
      const catalogEntry = s.codeSystem === 'ICD-10' ? catalogMap.get(s.code) : undefined;
      return {
        code: s.code,
        description: catalogEntry?.description ?? s.description,
        shortDescription: catalogEntry?.shortDescription ?? s.shortDescription ?? s.description,
        confidence: s.confidence,
        codeSystem: s.codeSystem,
        rationale: s.rationale,
        catalogMatch: !!catalogEntry,
        isBillable: catalogEntry?.isBillable ?? null,
      };
    });
  }

  private filterExistingCodes(
    suggestions: ClinicalCodingSuggestion[],
    existingCodes?: string[],
  ): ClinicalCodingSuggestion[] {
    if (!existingCodes?.length) return suggestions;
    const existing = new Set(existingCodes.map((c) => c.toUpperCase()));
    return suggestions.filter((s) => !existing.has(s.code.toUpperCase()));
  }

  // ─── Config resolution ─────────────────────────────────────

  /**
   * Resolve a config value with facility > tenant > instance hierarchy.
   */
  private async resolveConfigNumber(
    tenantId: string,
    facilityId: string,
    key: string,
    fallback: number,
  ): Promise<number> {
    try {
      // Facility level
      if (facilityId) {
        const facility = await this.foundationPrisma.facilityConfig.findUnique({
          where: { facilityId_configKey: { facilityId, configKey: key } },
        });
        if (facility) return Number(facility.value) || fallback;
      }
      // Tenant level
      const tenant = await this.foundationPrisma.tenantConfig.findUnique({
        where: { tenantId_configKey: { tenantId, configKey: key } },
      });
      if (tenant) return Number(tenant.value) || fallback;
      // Instance level
      const instance = await this.foundationPrisma.instanceConfig.findUnique({
        where: { configKey: key },
      });
      if (instance) return Number(instance.value) || fallback;
    } catch {
      // Config lookup failure should not block suggestions
    }
    return fallback;
  }
}
