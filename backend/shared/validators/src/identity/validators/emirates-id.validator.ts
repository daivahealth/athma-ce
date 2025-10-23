import {
  IIdentityValidator,
  ValidationResult,
  IdentityMetadata,
} from '../identity-validator.interface';

/**
 * Emirates ID Validator
 *
 * Validates UAE Emirates ID numbers according to official format:
 * Format: 784-YYYY-NNNNNNN-C
 * - 784: Country code for UAE
 * - YYYY: Year of birth or registration
 * - NNNNNNN: 7-digit sequence number
 * - C: Check digit (Luhn algorithm)
 *
 * @see https://u.ae/en/information-and-services/passports-and-traveling/emirates-id
 */
export class EmiratesIdValidator implements IIdentityValidator {
  readonly country = 'AE';
  readonly identityType = 'emirates_id';
  readonly metadata: IdentityMetadata = {
    country: 'AE',
    identityType: 'emirates_id',
    label: {
      en: 'Emirates ID',
      ar: 'الهوية الإماراتية',
    },
    format: '784-YYYY-NNNNNNN-C',
    example: '784-1990-1234567-8',
    requiresExpiry: true,
    isGovernmentIssued: true,
  };

  validate(value: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('Emirates ID is required');
      return { isValid: false, errors, warnings };
    }

    // Remove spaces and hyphens for validation
    const cleanValue = value.replace(/[\s-]/g, '');

    // Check length (15 digits)
    if (cleanValue.length !== 15) {
      errors.push('Emirates ID must be 15 digits long');
    }

    // Check if numeric
    if (!/^\d+$/.test(cleanValue)) {
      errors.push('Emirates ID must contain only numbers');
    }

    // Check country code (784)
    if (!cleanValue.startsWith('784')) {
      errors.push('Emirates ID must start with 784 (UAE country code)');
    }

    // Validate checksum using Luhn algorithm
    if (cleanValue.length === 15 && /^\d+$/.test(cleanValue)) {
      if (!this.validateChecksum(cleanValue)) {
        errors.push('Invalid Emirates ID check digit');
      }
    }

    // Extract and validate year
    if (cleanValue.length >= 7) {
      const year = parseInt(cleanValue.substring(3, 7), 10);
      const currentYear = new Date().getFullYear();

      if (year < 1900 || year > currentYear) {
        warnings.push(`Year ${year} seems unusual for an Emirates ID`);
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

    if (cleanValue.length !== 15) {
      return value; // Return original if invalid length
    }

    // Format: 784-YYYY-NNNNNNN-C
    return `${cleanValue.substring(0, 3)}-${cleanValue.substring(3, 7)}-${cleanValue.substring(7, 14)}-${cleanValue.substring(14)}`;
  }

  validateChecksum(value: string): boolean {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length !== 15) {
      return false;
    }

    // Luhn algorithm for check digit validation
    let sum = 0;
    let isEven = false;

    // Process digits from right to left (excluding check digit)
    for (let i = cleanValue.length - 2; i >= 0; i--) {
      let digit = parseInt(cleanValue[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleanValue[cleanValue.length - 1], 10);
  }

  extractMetadata(value: string): Record<string, any> {
    const cleanValue = value.replace(/\D/g, '');

    if (cleanValue.length !== 15) {
      return {};
    }

    return {
      countryCode: cleanValue.substring(0, 3),
      year: parseInt(cleanValue.substring(3, 7), 10),
      sequenceNumber: cleanValue.substring(7, 14),
      checkDigit: cleanValue.substring(14),
    };
  }
}
