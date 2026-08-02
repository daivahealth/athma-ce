import {
  IIdentityValidator,
  ValidationResult,
  IdentityMetadata,
} from '../identity-validator.interface';
import { isValidVerhoeff } from '../verhoeff';

/**
 * Aadhaar Number Validator
 *
 * Validates Indian Aadhaar numbers (Unique Identification Number)
 * Format: XXXX XXXX XXXX (12 digits)
 * - First digit cannot be 0 or 1
 * - Uses Verhoeff algorithm for check digit validation
 *
 * @see https://uidai.gov.in/
 */
export class AadhaarValidator implements IIdentityValidator {
  readonly country = 'IN';
  readonly identityType = 'aadhaar';
  readonly metadata: IdentityMetadata = {
    country: 'IN',
    identityType: 'aadhaar',
    label: {
      en: 'Aadhaar Number',
      ar: 'رقم آدهار',
    },
    format: 'XXXX XXXX XXXX',
    example: '2345 6789 0123',
    requiresExpiry: false,
    isGovernmentIssued: true,
  };

  validate(value: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('Aadhaar number is required');
      return { isValid: false, errors, warnings };
    }

    // Remove spaces and hyphens for validation
    const cleanValue = value.replace(/[\s-]/g, '');

    // Check length (12 digits)
    if (cleanValue.length !== 12) {
      errors.push('Aadhaar number must be 12 digits long');
    }

    // Check if numeric
    if (!/^\d+$/.test(cleanValue)) {
      errors.push('Aadhaar number must contain only numbers');
    }

    // First digit cannot be 0 or 1
    if (cleanValue.length > 0 && (cleanValue[0] === '0' || cleanValue[0] === '1')) {
      errors.push('Aadhaar number cannot start with 0 or 1');
    }

    // Validate checksum using Verhoeff algorithm
    if (cleanValue.length === 12 && /^\d+$/.test(cleanValue)) {
      if (!this.validateChecksum(cleanValue)) {
        errors.push('Invalid Aadhaar number check digit');
      }
    }

    const normalizedValue = this.format(cleanValue);

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
      normalizedValue: errors.length === 0 ? normalizedValue : undefined,
    };
  }

  format(value: string): string {
    // Remove all non-numeric characters
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length !== 12) {
      return value; // Return original if invalid length
    }

    // Format: XXXX XXXX XXXX
    return `${cleanValue.substring(0, 4)} ${cleanValue.substring(4, 8)} ${cleanValue.substring(8)}`;
  }

  validateChecksum(value: string): boolean {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.length === 12 && isValidVerhoeff(cleanValue);
  }

  extractMetadata(value: string): Record<string, any> {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length !== 12) {
      return {};
    }

    return {
      checkDigit: cleanValue.substring(11),
      maskedValue: `XXXX XXXX ${cleanValue.substring(8)}`, // Only last 4 digits shown for security
    };
  }
}
