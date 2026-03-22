/**
 * Catalog Writer Service
 * Writes catalog entries to the Clinical Service via its REST API.
 * Forwards tenant context headers for multi-tenancy.
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CatalogType } from '../dto/catalog-population.dto';
import { logger } from '../../../common/logger/logger.config';

/** Maps CatalogType to the Clinical Service REST endpoint path */
const ENDPOINT_MAP: Record<string, string> = {
  [CatalogType.MEDICATIONS]: '/catalogs/medications',
  [CatalogType.LAB_TESTS]: '/catalogs/lab-tests',
  [CatalogType.IMAGING_STUDIES]: '/catalogs/imaging-studies',
  [CatalogType.PROCEDURES]: '/catalogs/procedures',
  [CatalogType.DIAGNOSES]: '/catalogs/diagnoses',
  [CatalogType.ADMINISTRATIVE_SERVICES]: '/administrative-services',
  [CatalogType.NOTE_TEMPLATES]: '/note-templates',
  [CatalogType.VITAL_SIGNS_TEMPLATES]: '/vital-signs-templates',
  [CatalogType.VALUE_SETS]: '/value-sets',
  [CatalogType.CHECKLISTS]: '/checklists',
};

/** Maps JSON field names (camelCase) to API field names for each catalog type */
const FIELD_MAP: Partial<Record<string, Record<string, string>>> = {
  [CatalogType.MEDICATIONS]: {
    medicationName: 'medicationName',
    genericName: 'genericName',
    brandName: 'brandName',
    atcCode: 'atcCode',
    localCode: 'localCode',
    dosageForm: 'dosageForm',
    strength: 'strength',
    route: 'route',
    manufacturer: 'manufacturer',
    drugClass: 'drugClass',
    therapeuticClass: 'therapeuticClass',
    controlledSubstance: 'controlledSubstance',
    controlledClass: 'controlledClass',
    requiresPrescription: 'requiresPrescription',
    defaultFrequency: 'defaultFrequency',
    defaultDuration: 'defaultDuration',
    contraindications: 'contraindications',
    commonSideEffects: 'commonSideEffects',
    drugInteractions: 'drugInteractions',
    storageRequirements: 'storageRequirements',
  },
};

@Injectable()
export class CatalogWriterService {
  private readonly clinicalBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.clinicalBaseUrl = this.configService.get<string>(
      'CLINICAL_API_URL',
      'http://localhost:3011/api/v1',
    );
  }

  /**
   * Write a batch of entries to the Clinical Service for a specific catalog type.
   * Returns the number of successfully written entries.
   */
  async writeBatch(
    catalogType: CatalogType,
    entries: Record<string, unknown>[],
    tenantId: string,
    userId: string,
    facilityId: string,
  ): Promise<{ inserted: number; errors: string[] }> {
    const endpoint = ENDPOINT_MAP[catalogType];
    if (!endpoint) {
      return { inserted: 0, errors: [`No endpoint configured for catalog type: ${catalogType}`] };
    }

    const url = `${this.clinicalBaseUrl}${endpoint}`;
    const headers = {
      'x-tenant-id': tenantId,
      'x-user-id': userId,
      'x-facility-id': facilityId,
      'Content-Type': 'application/json',
    };

    let inserted = 0;
    const errors: string[] = [];

    // Write entries one at a time to handle individual failures gracefully
    for (const entry of entries) {
      try {
        // Add metadata to AI-generated entries
        const payload = { ...entry };

        await axios.post(url, payload, { headers, timeout: 10000 });
        inserted++;
      } catch (error: any) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        // 409 Conflict = duplicate, skip silently
        if (status === 409) {
          logger.debug(
            { catalogType, entry: (entry as any).medicationName || (entry as any).testName || (entry as any).code },
            'Duplicate entry skipped',
          );
          inserted++; // Count as success since data exists
          continue;
        }

        const entryName =
          (entry as any).medicationName ||
          (entry as any).testName ||
          (entry as any).studyName ||
          (entry as any).procedureName ||
          (entry as any).name ||
          (entry as any).code ||
          'unknown';

        errors.push(`Failed to write ${entryName}: ${message}`);
        logger.warn(
          { catalogType, entryName, status, message },
          'Failed to write catalog entry',
        );
      }
    }

    logger.info(
      { catalogType, total: entries.length, inserted, errors: errors.length },
      'Batch write completed',
    );

    return { inserted, errors };
  }

  /**
   * Check how many entries exist for a catalog type (to support idempotency)
   */
  async getCatalogCount(
    catalogType: CatalogType,
    tenantId: string,
    userId: string,
    facilityId: string,
  ): Promise<number> {
    const endpoint = ENDPOINT_MAP[catalogType];
    if (!endpoint) return 0;

    try {
      const url = `${this.clinicalBaseUrl}${endpoint}`;
      const headers = {
        'x-tenant-id': tenantId,
        'x-user-id': userId,
        'x-facility-id': facilityId,
      };

      const response = await axios.get(url, {
        headers,
        params: { limit: 1 },
        timeout: 5000,
      });

      // API returns either { total, data } or just an array
      if (response.data?.total !== undefined) {
        return response.data.total;
      }
      if (Array.isArray(response.data)) {
        return response.data.length;
      }
      return 0;
    } catch {
      return 0;
    }
  }
}
