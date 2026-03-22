/**
 * Catalog Population Service
 * Orchestrates the async catalog population process.
 *
 * Flow per catalog type:
 * 1. Check if data already exists (skip if replaceExisting is false)
 * 2. Load template data (Tier 1/2) or skip to AI generation (Tier 3)
 * 3. Optionally enrich with AI (Tier 2)
 * 4. Validate entries
 * 5. Write to Clinical Service via REST API
 * 6. Update progress
 */

import { Injectable } from '@nestjs/common';
import { ConfigClientService } from '../../../shared/llm-client/config-client.service';
import { TemplateLoaderService } from './template-loader.service';
import { AiCatalogGeneratorService } from './ai-catalog-generator.service';
import { CatalogValidatorService } from './catalog-validator.service';
import { CatalogWriterService } from './catalog-writer.service';
import { CatalogJobTrackerService } from './catalog-job-tracker.service';
import {
  CatalogType,
  DataSource,
  JobStatus,
  StartCatalogPopulationDto,
  CountryInfoDto,
} from '../dto/catalog-population.dto';
import { logger } from '../../../common/logger/logger.config';

/** Ordered sequence for catalog population (dependency order) */
const CATALOG_ORDER: CatalogType[] = [
  CatalogType.VALUE_SETS,
  CatalogType.DIAGNOSES,
  CatalogType.MEDICATIONS,
  CatalogType.LAB_TESTS,
  CatalogType.IMAGING_STUDIES,
  CatalogType.PROCEDURES,
  CatalogType.ADMINISTRATIVE_SERVICES,
  CatalogType.NOTE_TEMPLATES,
  CatalogType.VITAL_SIGNS_TEMPLATES,
  CatalogType.CHECKLISTS,
];

/** Tier classification for each catalog type */
const CATALOG_TIERS: Record<CatalogType, 1 | 2 | 3> = {
  [CatalogType.DIAGNOSES]: 1,
  [CatalogType.LAB_TESTS]: 1,
  [CatalogType.MEDICATIONS]: 2,
  [CatalogType.IMAGING_STUDIES]: 2,
  [CatalogType.PROCEDURES]: 2,
  [CatalogType.VALUE_SETS]: 3,
  [CatalogType.ADMINISTRATIVE_SERVICES]: 3,
  [CatalogType.NOTE_TEMPLATES]: 3,
  [CatalogType.VITAL_SIGNS_TEMPLATES]: 3,
  [CatalogType.CHECKLISTS]: 3,
};

/** Country names for display */
const COUNTRY_NAMES: Record<string, string> = {
  AE: 'United Arab Emirates',
  IN: 'India',
  GB: 'United Kingdom',
  US: 'United States',
  SG: 'Singapore',
  SA: 'Saudi Arabia',
};

@Injectable()
export class CatalogPopulationService {
  // Track cancellation requests in-memory
  private cancelledJobs = new Set<string>();

  constructor(
    private configClient: ConfigClientService,
    private templateLoader: TemplateLoaderService,
    private aiGenerator: AiCatalogGeneratorService,
    private validator: CatalogValidatorService,
    private writer: CatalogWriterService,
    private jobTracker: CatalogJobTrackerService,
  ) {}

  /**
   * Start a catalog population job (async - runs in background)
   */
  async startPopulation(
    dto: StartCatalogPopulationDto,
    tenantId: string,
    userId: string,
    facilityId: string,
  ): Promise<{ jobId: string; totalCatalogs: number }> {
    // Check feature flag
    const enabled = await this.configClient.resolve('ai.catalog_population.enabled');
    if (enabled === false) {
      throw new Error('Catalog population is disabled');
    }

    // Check for existing running jobs
    if (await this.jobTracker.hasRunningJob(tenantId)) {
      throw new Error('A catalog population job is already running for this tenant');
    }

    // Determine catalog types to populate
    const catalogTypes = dto.catalogTypes?.length
      ? CATALOG_ORDER.filter((ct) => dto.catalogTypes!.includes(ct))
      : [...CATALOG_ORDER];

    // Create job
    const jobId = await this.jobTracker.createJob(tenantId, userId, dto.countryIso, catalogTypes);

    // Run population in background (fire and forget)
    this.runPopulation(jobId, dto.countryIso, catalogTypes, dto.replaceExisting ?? false, tenantId, userId, facilityId)
      .catch((error) => {
        logger.error({ jobId, error }, 'Unhandled error in catalog population');
        this.jobTracker.markFailed(jobId, error.message || 'Unexpected error');
      });

    return { jobId, totalCatalogs: catalogTypes.length };
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    const progress = await this.jobTracker.getProgress(jobId);
    if (!progress || progress.status !== JobStatus.RUNNING) {
      return false;
    }

    this.cancelledJobs.add(jobId);
    await this.jobTracker.markCancelled(jobId);
    return true;
  }

  /**
   * Get available countries with template coverage info
   */
  getCountries(): CountryInfoDto[] {
    const templateCountries = this.templateLoader.getAvailableCountries();
    const allCatalogTypes = Object.values(CatalogType);

    return templateCountries.map((country) => {
      const aiGeneratedCatalogs = allCatalogTypes.filter(
        (ct) => !country.catalogs.includes(ct),
      );

      return {
        countryIso: country.countryIso,
        countryName: country.countryName,
        hasTemplates: true,
        templateCatalogs: country.catalogs,
        aiGeneratedCatalogs: aiGeneratedCatalogs as CatalogType[],
      };
    });
  }

  // ---------- Internal orchestration ----------

  private async runPopulation(
    jobId: string,
    countryIso: string,
    catalogTypes: CatalogType[],
    replaceExisting: boolean,
    tenantId: string,
    userId: string,
    facilityId: string,
  ): Promise<void> {
    await this.jobTracker.markRunning(jobId);
    const countryName = COUNTRY_NAMES[countryIso.toUpperCase()] || countryIso;

    for (const catalogType of catalogTypes) {
      // Check cancellation
      if (this.cancelledJobs.has(jobId)) {
        this.cancelledJobs.delete(jobId);
        return;
      }

      await this.jobTracker.updateCatalogProgress(
        jobId,
        catalogType,
        'in_progress',
        DataSource.TEMPLATE,
        0,
      );

      try {
        // Check existing data (skip if not replacing)
        if (!replaceExisting) {
          const existingCount = await this.writer.getCatalogCount(
            catalogType,
            tenantId,
            userId,
            facilityId,
          );
          if (existingCount > 0) {
            logger.info(
              { catalogType, existingCount },
              'Catalog already has data, skipping',
            );
            await this.jobTracker.updateCatalogProgress(
              jobId,
              catalogType,
              'skipped',
              DataSource.TEMPLATE,
              0,
            );
            continue;
          }
        }

        // Process based on tier
        const result = await this.processCatalog(
          catalogType,
          countryIso,
          countryName,
          tenantId,
          userId,
          facilityId,
        );

        await this.jobTracker.updateCatalogProgress(
          jobId,
          catalogType,
          'completed',
          result.dataSource,
          result.inserted,
        );
      } catch (error: any) {
        logger.error(
          { catalogType, jobId, error: error.message },
          'Failed to populate catalog',
        );
        await this.jobTracker.updateCatalogProgress(
          jobId,
          catalogType,
          'failed',
          DataSource.TEMPLATE,
          0,
          error.message,
        );
        // Continue with next catalog type (don't fail entire job)
      }
    }

    // Mark job as completed
    if (!this.cancelledJobs.has(jobId)) {
      await this.jobTracker.markCompleted(jobId);
    }
  }

  private async processCatalog(
    catalogType: CatalogType,
    countryIso: string,
    countryName: string,
    tenantId: string,
    userId: string,
    facilityId: string,
  ): Promise<{ inserted: number; dataSource: DataSource }> {
    const tier = CATALOG_TIERS[catalogType];

    let entries: Record<string, unknown>[] = [];
    let dataSource: DataSource = DataSource.TEMPLATE;

    if (tier === 1 || tier === 2) {
      // Try to load template
      const template = this.templateLoader.loadTemplate(countryIso, catalogType);

      if (template) {
        entries = template.entries;
        dataSource = template.source;

        // Tier 2: Enrich with AI
        if (tier === 2 && !template.fromDefault) {
          // Only enrich country-specific templates (not default ones — those are already generic)
          try {
            const enriched = await this.aiGenerator.enrichEntries(
              catalogType,
              entries,
              countryIso,
              countryName,
            );
            entries = enriched.entries;
            dataSource = enriched.dataSource;
          } catch (error) {
            logger.warn(
              { catalogType, countryIso, error },
              'AI enrichment failed, using plain template',
            );
          }
        }
      } else if (tier === 2) {
        // No template available for Tier 2 — fall back to AI generation
        const generated = await this.aiGenerator.generateEntries(
          catalogType,
          countryIso,
          countryName,
        );
        entries = generated.entries;
        dataSource = generated.dataSource;
      }
    } else {
      // Tier 3: AI-generated
      const generated = await this.aiGenerator.generateEntries(
        catalogType,
        countryIso,
        countryName,
      );
      entries = generated.entries;
      dataSource = generated.dataSource;
    }

    if (entries.length === 0) {
      logger.info({ catalogType, countryIso }, 'No entries to write');
      return { inserted: 0, dataSource };
    }

    // Validate entries
    const { valid, invalid } = this.validator.validateEntries(catalogType, entries);
    if (invalid.length > 0) {
      logger.warn(
        { catalogType, invalidCount: invalid.length },
        'Some entries failed validation',
      );
    }

    // Write valid entries
    const result = await this.writer.writeBatch(
      catalogType,
      valid,
      tenantId,
      userId,
      facilityId,
    );

    return { inserted: result.inserted, dataSource };
  }
}
