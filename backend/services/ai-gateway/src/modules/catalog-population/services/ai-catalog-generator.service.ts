/**
 * AI Catalog Generator Service
 * Uses LLM to generate or enrich catalog entries for country-specific data.
 *
 * Tier 2: Enriches template entries with country-specific context (local brand names, billing codes)
 * Tier 3: Generates entries from scratch for country-specific catalogs (admin services, note templates, etc.)
 */

import { Injectable } from '@nestjs/common';
import { LLMClientService } from '../../../shared/llm-client/llm-client.service';
import { CatalogType, DataSource } from '../dto/catalog-population.dto';
import { logger } from '../../../common/logger/logger.config';

interface GenerationResult {
  entries: Record<string, unknown>[];
  dataSource: DataSource;
}

@Injectable()
export class AiCatalogGeneratorService {
  constructor(private llmClient: LLMClientService) {}

  /**
   * Enrich existing template entries with country-specific context (Tier 2)
   */
  async enrichEntries(
    catalogType: CatalogType,
    entries: Record<string, unknown>[],
    countryIso: string,
    countryName: string,
  ): Promise<GenerationResult> {
    const systemPrompt = this.getEnrichmentPrompt(catalogType, countryIso, countryName);
    const batchSize = 10;
    const enriched: Record<string, unknown>[] = [];

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);
      try {
        const response = await this.llmClient.completion({
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Enrich the following ${catalogType} entries with ${countryName}-specific data. Return a JSON array of the enriched entries, preserving all existing fields and adding country-specific information.\n\nEntries:\n${JSON.stringify(batch, null, 2)}`,
            },
          ],
          temperature: 0.1,
          maxTokens: 8000,
        });

        const parsed = this.parseJsonResponse(response.content);
        if (Array.isArray(parsed)) {
          enriched.push(...parsed);
        } else {
          // If parsing fails, use original entries
          enriched.push(...batch);
        }
      } catch (error) {
        logger.warn(
          { catalogType, countryIso, batchIndex: i, error },
          'AI enrichment failed for batch, using originals',
        );
        enriched.push(...batch);
      }
    }

    return { entries: enriched, dataSource: DataSource.AI_ENRICHED };
  }

  /**
   * Generate catalog entries from scratch (Tier 3)
   */
  async generateEntries(
    catalogType: CatalogType,
    countryIso: string,
    countryName: string,
  ): Promise<GenerationResult> {
    const systemPrompt = this.getGenerationPrompt(catalogType, countryIso, countryName);
    const userPrompt = this.getGenerationUserPrompt(catalogType, countryName);

    try {
      const response = await this.llmClient.completion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        maxTokens: 8000,
      });

      const parsed = this.parseJsonResponse(response.content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tag all AI-generated entries with metadata
        const tagged = parsed.map((entry: Record<string, unknown>) => ({
          ...entry,
          metadata: {
            source: 'ai-generated',
            reviewStatus: 'pending',
            generatedFor: countryIso,
          },
        }));

        logger.info(
          { catalogType, countryIso, count: tagged.length },
          'AI-generated catalog entries',
        );
        return { entries: tagged, dataSource: DataSource.AI_GENERATED };
      }

      logger.warn({ catalogType, countryIso }, 'AI generation returned empty result');
      return { entries: [], dataSource: DataSource.AI_GENERATED };
    } catch (error) {
      logger.error({ catalogType, countryIso, error }, 'AI catalog generation failed');
      return { entries: [], dataSource: DataSource.AI_GENERATED };
    }
  }

  /**
   * Parse JSON from LLM response, handling markdown code blocks
   */
  private parseJsonResponse(content: string): Record<string, unknown>[] | null {
    try {
      // Try direct parse
      return JSON.parse(content);
    } catch {
      // Try extracting from markdown code block
      const match = content.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch {
          // fall through
        }
      }

      // Try finding array in the text
      const arrayMatch = content.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        try {
          return JSON.parse(arrayMatch[0]);
        } catch {
          // fall through
        }
      }

      logger.error('Failed to parse LLM JSON response');
      return null;
    }
  }

  // ---------- Prompt Templates ----------

  private getEnrichmentPrompt(catalogType: CatalogType, countryIso: string, countryName: string): string {
    const base = `You are a healthcare data specialist for ${countryName} (${countryIso}). Your task is to enrich medical catalog entries with country-specific information.

IMPORTANT RULES:
- Preserve ALL existing fields exactly as provided
- Add country-specific fields where relevant
- Do NOT modify existing medical codes (ICD-10, LOINC, ATC, CPT)
- Return ONLY a valid JSON array, no markdown, no explanations
- Use accurate, factual information about ${countryName}'s healthcare system`;

    switch (catalogType) {
      case CatalogType.MEDICATIONS:
        return `${base}

For medications, add these country-specific fields:
- "localBrandNames": array of brand names commonly available in ${countryName}
- "regulatoryNotes": any country-specific regulatory information
- "availabilityNotes": common availability information in ${countryName}`;

      case CatalogType.IMAGING_STUDIES:
        return `${base}

For imaging studies, add:
- "localBillingNotes": billing context for ${countryName}
- "availabilityNotes": where these studies are commonly available`;

      case CatalogType.PROCEDURES:
        return `${base}

For procedures, add:
- "localBillingNotes": billing context for ${countryName}
- "regulatoryRequirements": country-specific regulatory requirements`;

      default:
        return base;
    }
  }

  private getGenerationPrompt(catalogType: CatalogType, countryIso: string, countryName: string): string {
    switch (catalogType) {
      case CatalogType.ADMINISTRATIVE_SERVICES:
        return `You are a healthcare administration expert for ${countryName} (${countryIso}). Generate administrative service catalog entries that are common in ${countryName}'s healthcare facilities.

RULES:
- Return ONLY a valid JSON array
- Each entry must have: name, serviceCode (format: ADM-NNN), category, description, defaultPrice (number), currency, isActive (true)
- Categories: Registration, Consultation, Nursing, Administrative, Facility, Documentation
- Use accurate, realistic service names and prices for ${countryName}
- Include services specific to ${countryName}'s healthcare system`;

      case CatalogType.NOTE_TEMPLATES:
        return `You are a clinical documentation specialist for ${countryName} (${countryIso}). Generate clinical note templates common in ${countryName}'s healthcare system.

RULES:
- Return ONLY a valid JSON array
- Each entry must have: name, templateType (GENERAL|SOAP|DISCHARGE_SUMMARY|PROGRESS_NOTE|CONSULTATION|PROCEDURE_NOTE|OPERATIVE_NOTE), description, status ("active")
- Include templates aligned with ${countryName}'s regulatory requirements
- Include templateSchema as a JSON object with sections and fields`;

      case CatalogType.VITAL_SIGNS_TEMPLATES:
        return `You are a clinical informatics specialist for ${countryName} (${countryIso}). Generate vital signs template configurations.

RULES:
- Return ONLY a valid JSON array
- Each entry must have: name, description, careSetting (outpatient|inpatient|emergency|icu|pediatric), parameters (JSON array of vital sign parameters)
- Each parameter: { code, name, unit, normalMin, normalMax, criticalMin, criticalMax }
- Use medically accurate reference ranges`;

      case CatalogType.VALUE_SETS:
        return `You are a healthcare data standards expert for ${countryName} (${countryIso}). Generate value set entries commonly used in ${countryName}'s healthcare system.

RULES:
- Return ONLY a valid JSON array
- Each entry must have: code (unique identifier), name, category, values (JSON array of { code, display, isDefault })
- Categories: Demographics, Clinical, Administrative, Billing
- Include country-specific value sets (ID types, nationalities, insurance categories, etc.)`;

      case CatalogType.CHECKLISTS:
        return `You are a clinical quality specialist for ${countryName} (${countryIso}). Generate checklist templates for common clinical workflows.

RULES:
- Return ONLY a valid JSON array
- Each entry must have: name, description, category (admission|discharge|pre-procedure|post-procedure|safety|handoff), items (JSON array of { text, isRequired, order })
- Include checklists aligned with ${countryName}'s healthcare standards`;

      default:
        return `You are a healthcare data specialist. Generate catalog entries as a valid JSON array.`;
    }
  }

  private getGenerationUserPrompt(catalogType: CatalogType, countryName: string): string {
    switch (catalogType) {
      case CatalogType.ADMINISTRATIVE_SERVICES:
        return `Generate 15 common administrative services for a healthcare facility in ${countryName}. Include registration fees, consultation fees, nursing services, documentation services, and facility charges. Return as a JSON array.`;

      case CatalogType.NOTE_TEMPLATES:
        return `Generate 8 clinical note templates commonly used in ${countryName}'s healthcare facilities. Include at least: General Consultation, SOAP Note, Discharge Summary, Progress Note, and Procedure Note. Return as a JSON array.`;

      case CatalogType.VITAL_SIGNS_TEMPLATES:
        return `Generate 5 vital signs templates for different care settings: Outpatient, Inpatient General, Emergency, ICU, and Pediatric. Each should have appropriate vital sign parameters with normal and critical ranges. Return as a JSON array.`;

      case CatalogType.VALUE_SETS:
        return `Generate 10 common value sets used in ${countryName}'s healthcare system. Include: Gender, Blood Group, Marital Status, ID Document Types, Relationship Types, Payment Methods, Visit Types, Appointment Status, Referral Sources, and Insurance Categories. Return as a JSON array.`;

      case CatalogType.CHECKLISTS:
        return `Generate 6 clinical checklists: Admission Checklist, Discharge Checklist, Pre-Operative Checklist, Post-Operative Checklist, Patient Safety Checklist, and Nursing Handoff Checklist. Return as a JSON array.`;

      default:
        return `Generate appropriate catalog entries for ${countryName}. Return as a JSON array.`;
    }
  }
}
