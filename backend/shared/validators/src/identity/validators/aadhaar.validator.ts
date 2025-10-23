import {
  IIdentityValidator,
  ValidationResult,
  IdentityMetadata,
} from '../identity-validator.interface';

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

  // Verhoeff algorithm tables
  private readonly d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
  ];

  private readonly p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
  ];

  private readonly inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

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

    if (cleanValue.length !== 12) {
      return false;
    }

    // Verhoeff algorithm
    let c = 0;
    const reversedDigits = cleanValue.split('').map(Number).reverse();

    for (let i = 0; i < reversedDigits.length; i++) {
      c = this.d[c][this.p[(i % 8)][reversedDigits[i]]];
    }

    return c === 0;
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
