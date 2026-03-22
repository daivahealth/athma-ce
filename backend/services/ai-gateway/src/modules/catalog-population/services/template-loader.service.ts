/**
 * Template Loader Service
 * Loads curated JSON template files from the data/countries/ directory.
 * Falls back to _default/ if country-specific templates are not available.
 */

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../../common/logger/logger.config';
import { CatalogType, DataSource } from '../dto/catalog-population.dto';

export interface TemplateFile {
  version: string;
  countryIso: string;
  countryName: string;
  catalogType: string;
  codeSet?: string; // For diagnoses: 'ICD-10-CM', 'ICD-11'
  entries: Record<string, unknown>[];
}

export interface LoadResult {
  entries: Record<string, unknown>[];
  source: DataSource;
  countryIso: string;
  fromDefault: boolean;
}

/** Maps CatalogType enum values to file names in the data/countries/ directory */
const CATALOG_FILE_MAP: Partial<Record<CatalogType, string>> = {
  [CatalogType.MEDICATIONS]: 'medications.json',
  [CatalogType.LAB_TESTS]: 'lab-tests.json',
  [CatalogType.IMAGING_STUDIES]: 'imaging-studies.json',
  [CatalogType.PROCEDURES]: 'procedures.json',
  [CatalogType.DIAGNOSES]: 'diagnoses-icd10cm.json',
};

/** Country names for display purposes */
const COUNTRY_NAMES: Record<string, string> = {
  AE: 'United Arab Emirates',
  IN: 'India',
  GB: 'United Kingdom',
  US: 'United States',
  SG: 'Singapore',
  SA: 'Saudi Arabia',
};

@Injectable()
export class TemplateLoaderService {
  private readonly dataDir: string;

  constructor() {
    this.dataDir = path.resolve(__dirname, '..', 'data', 'countries');
  }

  /**
   * Load template data for a specific catalog type and country.
   * Falls back to _default/ if the country-specific file doesn't exist.
   * Returns null if no template is available (catalog should be AI-generated).
   */
  loadTemplate(countryIso: string, catalogType: CatalogType): LoadResult | null {
    const fileName = CATALOG_FILE_MAP[catalogType];
    if (!fileName) {
      // No template file mapping for this catalog type (it's AI-generated)
      return null;
    }

    // Try country-specific first
    const countryPath = path.join(this.dataDir, countryIso.toUpperCase(), fileName);
    if (fs.existsSync(countryPath)) {
      const data = this.readTemplateFile(countryPath);
      if (data) {
        logger.info(
          { countryIso, catalogType, entries: data.entries.length },
          'Loaded country-specific template',
        );
        return {
          entries: data.entries,
          source: DataSource.TEMPLATE,
          countryIso: countryIso.toUpperCase(),
          fromDefault: false,
        };
      }
    }

    // Fall back to default
    const defaultPath = path.join(this.dataDir, '_default', fileName);
    if (fs.existsSync(defaultPath)) {
      const data = this.readTemplateFile(defaultPath);
      if (data) {
        logger.info(
          { countryIso, catalogType, entries: data.entries.length },
          'Loaded default template (country-specific not available)',
        );
        return {
          entries: data.entries,
          source: DataSource.TEMPLATE,
          countryIso: '_default',
          fromDefault: true,
        };
      }
    }

    logger.info({ countryIso, catalogType }, 'No template available for catalog type');
    return null;
  }

  /**
   * Get list of countries with template data
   */
  getAvailableCountries(): { countryIso: string; countryName: string; catalogs: CatalogType[] }[] {
    const countries: { countryIso: string; countryName: string; catalogs: CatalogType[] }[] = [];

    if (!fs.existsSync(this.dataDir)) {
      return countries;
    }

    const dirs = fs.readdirSync(this.dataDir, { withFileTypes: true });
    for (const dir of dirs) {
      if (!dir.isDirectory() || dir.name === '_default') continue;

      const countryIso = dir.name;
      const catalogs: CatalogType[] = [];

      for (const [catalogType, fileName] of Object.entries(CATALOG_FILE_MAP)) {
        const filePath = path.join(this.dataDir, countryIso, fileName);
        if (fs.existsSync(filePath)) {
          catalogs.push(catalogType as CatalogType);
        }
      }

      if (catalogs.length > 0) {
        countries.push({
          countryIso,
          countryName: COUNTRY_NAMES[countryIso] || countryIso,
          catalogs,
        });
      }
    }

    return countries;
  }

  /**
   * Check if a specific country has a template for a catalog type
   */
  hasTemplate(countryIso: string, catalogType: CatalogType): boolean {
    const fileName = CATALOG_FILE_MAP[catalogType];
    if (!fileName) return false;

    const countryPath = path.join(this.dataDir, countryIso.toUpperCase(), fileName);
    if (fs.existsSync(countryPath)) return true;

    const defaultPath = path.join(this.dataDir, '_default', fileName);
    return fs.existsSync(defaultPath);
  }

  /**
   * Read and parse a template JSON file
   */
  private readTemplateFile(filePath: string): TemplateFile | null {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as TemplateFile;

      if (!data.entries || !Array.isArray(data.entries)) {
        logger.error({ filePath }, 'Template file missing entries array');
        return null;
      }

      return data;
    } catch (error) {
      logger.error({ error, filePath }, 'Failed to read template file');
      return null;
    }
  }
}
