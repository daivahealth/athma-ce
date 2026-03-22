/**
 * Catalog Validator Service
 * Validates medical codes and catalog entries before writing to the database.
 * Ensures code format correctness for ICD-10, LOINC, ATC, CPT, and other standards.
 */

import { Injectable } from '@nestjs/common';
import { logger } from '../../../common/logger/logger.config';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

@Injectable()
export class CatalogValidatorService {
  // Standard medical code format patterns
  private readonly patterns = {
    icd10: /^[A-Z][0-9]{2}(\.[0-9]{1,4})?$/,
    loinc: /^[0-9]{1,7}-[0-9]$/,
    atc: /^[A-Z][0-9]{2}[A-Z]{2}[0-9]{2}$/,
    cpt: /^[0-9]{5}$/,
    icd10pcs: /^[0-9A-Z]{7}$/,
    ndc: /^[0-9]{4,5}-[0-9]{3,4}-[0-9]{1,2}$/,
  };

  /**
   * Validate a medication entry
   */
  validateMedication(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.medicationName || typeof entry.medicationName !== 'string') {
      errors.push('medicationName is required');
    }
    if (!entry.genericName || typeof entry.genericName !== 'string') {
      errors.push('genericName is required');
    }
    if (entry.atcCode && !this.patterns.atc.test(entry.atcCode as string)) {
      errors.push(`Invalid ATC code format: ${entry.atcCode}`);
    }
    if (!entry.dosageForm || typeof entry.dosageForm !== 'string') {
      errors.push('dosageForm is required');
    }
    if (!entry.strength || typeof entry.strength !== 'string') {
      errors.push('strength is required');
    }
    if (!entry.route || typeof entry.route !== 'string') {
      errors.push('route is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate a lab test entry
   */
  validateLabTest(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.testName || typeof entry.testName !== 'string') {
      errors.push('testName is required');
    }
    if (entry.loincCode && !this.patterns.loinc.test(entry.loincCode as string)) {
      errors.push(`Invalid LOINC code format: ${entry.loincCode}`);
    }
    if (entry.cptCode && !this.patterns.cpt.test(entry.cptCode as string)) {
      errors.push(`Invalid CPT code format: ${entry.cptCode}`);
    }
    if (!entry.testCategory || typeof entry.testCategory !== 'string') {
      errors.push('testCategory is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate an imaging study entry
   */
  validateImagingStudy(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.studyName || typeof entry.studyName !== 'string') {
      errors.push('studyName is required');
    }
    if (entry.cptCode && !this.patterns.cpt.test(entry.cptCode as string)) {
      errors.push(`Invalid CPT code format: ${entry.cptCode}`);
    }
    if (!entry.modality || typeof entry.modality !== 'string') {
      errors.push('modality is required');
    }
    if (!entry.bodyPart || typeof entry.bodyPart !== 'string') {
      errors.push('bodyPart is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate a procedure entry
   */
  validateProcedure(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.procedureName || typeof entry.procedureName !== 'string') {
      errors.push('procedureName is required');
    }
    if (entry.cptCode && !this.patterns.cpt.test(entry.cptCode as string)) {
      errors.push(`Invalid CPT code format: ${entry.cptCode}`);
    }
    if (entry.icd10PcsCode && !this.patterns.icd10pcs.test(entry.icd10PcsCode as string)) {
      errors.push(`Invalid ICD-10-PCS code format: ${entry.icd10PcsCode}`);
    }
    if (!entry.procedureCategory || typeof entry.procedureCategory !== 'string') {
      errors.push('procedureCategory is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate a diagnosis entry
   */
  validateDiagnosis(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.code || typeof entry.code !== 'string') {
      errors.push('code is required');
    } else if (!this.patterns.icd10.test(entry.code as string)) {
      errors.push(`Invalid ICD-10 code format: ${entry.code}`);
    }
    if (!entry.description || typeof entry.description !== 'string') {
      errors.push('description is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate an administrative service entry
   */
  validateAdministrativeService(entry: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];

    if (!entry.name || typeof entry.name !== 'string') {
      errors.push('name is required');
    }
    if (!entry.serviceCode || typeof entry.serviceCode !== 'string') {
      errors.push('serviceCode is required');
    }
    if (!entry.category || typeof entry.category !== 'string') {
      errors.push('category is required');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate entries based on catalog type
   */
  validateEntries(
    catalogType: string,
    entries: Record<string, unknown>[],
  ): { valid: Record<string, unknown>[]; invalid: { entry: Record<string, unknown>; errors: string[] }[] } {
    const valid: Record<string, unknown>[] = [];
    const invalid: { entry: Record<string, unknown>; errors: string[] }[] = [];

    for (const entry of entries) {
      let result: ValidationResult;

      switch (catalogType) {
        case 'medications':
          result = this.validateMedication(entry);
          break;
        case 'lab-tests':
          result = this.validateLabTest(entry);
          break;
        case 'imaging-studies':
          result = this.validateImagingStudy(entry);
          break;
        case 'procedures':
          result = this.validateProcedure(entry);
          break;
        case 'diagnoses':
          result = this.validateDiagnosis(entry);
          break;
        case 'administrative-services':
          result = this.validateAdministrativeService(entry);
          break;
        default:
          // For catalog types without strict validation (note-templates, vital-signs, etc.)
          result = { valid: true, errors: [] };
      }

      if (result.valid) {
        valid.push(entry);
      } else {
        invalid.push({ entry, errors: result.errors });
        logger.warn(
          { catalogType, errors: result.errors },
          'Catalog entry failed validation',
        );
      }
    }

    return { valid, invalid };
  }
}
