import {
  IIdentityValidator,
  ValidationResult,
  IdentityMetadata,
} from '../identity-validator.interface';

/**
 * Passport Number Validator
 *
 * Generic passport validator for international passports
 * Different countries have different formats, so this provides basic validation
 * Country-specific validation can be added based on issuing country
 *
 * Common formats:
 * - Most countries: 6-9 alphanumeric characters
 * - US: 9 digits or 1 letter + 8 digits
 * - UK: 9 digits
 * - India: 1 letter + 7 digits
 */
export class PassportValidator implements IIdentityValidator {
  readonly country = 'INTL'; // International
  readonly identityType = 'passport';
  readonly metadata: IdentityMetadata = {
    country: 'INTL',
    identityType: 'passport',
    label: {
      en: 'Passport Number',
      ar: 'رقم جواز السفر',
    },
    format: 'Alphanumeric (6-9 characters)',
    example: 'A1234567',
    requiresExpiry: true,
    isGovernmentIssued: true,
  };

  private readonly countryFormats: Record<string, RegExp> = {
    US: /^[0-9]{9}$|^[A-Z][0-9]{8}$/, // 9 digits or letter + 8 digits
    GB: /^[0-9]{9}$/, // 9 digits
    IN: /^[A-Z][0-9]{7}$/, // Letter + 7 digits
    AE: /^[A-Z][0-9]{7}$/, // Letter + 7 digits
    CA: /^[A-Z]{2}[0-9]{6}$/, // 2 letters + 6 digits
    AU: /^[A-Z][0-9]{7}$/, // Letter + 7 digits
    SG: /^[A-Z][0-9]{7}[A-Z]$/, // Letter + 7 digits + letter
    // Add more countries as needed
  };

  validate(value: string, issuingCountry?: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!value || value.trim() === '') {
      errors.push('Passport number is required');
      return { isValid: false, errors, warnings };
    }

    // Remove spaces and hyphens
    const cleanValue = value.replace(/[\s-]/g, '').toUpperCase();

    // Basic length check
    if (cleanValue.length < 6 || cleanValue.length > 15) {
      errors.push('Passport number must be between 6 and 15 characters');
    }

    // Check alphanumeric
    if (!/^[A-Z0-9]+$/.test(cleanValue)) {
      errors.push('Passport number must contain only letters and numbers');
    }

    // Country-specific validation if issuing country is provided
    if (issuingCountry && this.countryFormats[issuingCountry]) {
      const countryFormat = this.countryFormats[issuingCountry];
      if (!countryFormat.test(cleanValue)) {
        errors.push(
          `Invalid passport format for ${issuingCountry}. Expected format varies by country.`
        );
      }
    } else if (cleanValue.length >= 6 && cleanValue.length <= 15) {
      // Generic validation passed
      if (!issuingCountry) {
        warnings.push('Consider providing issuing country for more accurate validation');
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
    // Convert to uppercase and remove non-alphanumeric
    return value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  }

  extractMetadata(value: string, issuingCountry?: string): Record<string, any> {
    const cleanValue = this.format(value);

    const metadata: Record<string, any> = {
      length: cleanValue.length,
      hasLetters: /[A-Z]/.test(cleanValue),
      hasNumbers: /[0-9]/.test(cleanValue),
    };

    if (issuingCountry) {
      metadata.issuingCountry = issuingCountry;
      metadata.matchesCountryFormat = this.countryFormats[issuingCountry]
        ? this.countryFormats[issuingCountry].test(cleanValue)
        : null;
    }

    return metadata;
  }
}
