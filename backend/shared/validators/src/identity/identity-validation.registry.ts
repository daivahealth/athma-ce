import { IIdentityValidator, ValidationResult } from './identity-validator.interface';
import { EmiratesIdValidator } from './validators/emirates-id.validator';
import { AadhaarValidator } from './validators/aadhaar.validator';
import { PassportValidator } from './validators/passport.validator';

/**
 * Identity Validation Registry
 *
 * Central registry for managing identity validators across different countries
 * and document types. Provides a unified interface for validation.
 */
export class IdentityValidationRegistry {
  private static validators = new Map<string, IIdentityValidator>();

  /**
   * Initialize the registry with default validators
   */
  static initialize(): void {
    // Register default validators
    this.register(new EmiratesIdValidator());
    this.register(new AadhaarValidator());
    this.register(new PassportValidator());
  }

  /**
   * Register a new identity validator
   * @param validator The validator instance to register
   */
  static register(validator: IIdentityValidator): void {
    const key = this.createKey(validator.country, validator.identityType);
    this.validators.set(key, validator);
  }

  /**
   * Get a validator by country and identity type
   * @param country ISO 3166-1 alpha-2 country code
   * @param identityType The identity document type
   * @returns The validator instance or undefined
   */
  static getValidator(country: string, identityType: string): IIdentityValidator | undefined {
    const key = this.createKey(country, identityType);
    return this.validators.get(key);
  }

  /**
   * Validate an identity document
   * @param country ISO 3166-1 alpha-2 country code
   * @param identityType The identity document type
   * @param value The document number to validate
   * @returns Validation result
   */
  static validate(country: string, identityType: string, value: string): ValidationResult {
    const validator = this.getValidator(country, identityType);

    if (!validator) {
      return {
        isValid: false,
        errors: [`No validator found for ${country}/${identityType}`],
      };
    }

    return validator.validate(value);
  }

  /**
   * Format an identity document number
   * @param country ISO 3166-1 alpha-2 country code
   * @param identityType The identity document type
   * @param value The document number to format
   * @returns Formatted document number
   */
  static format(country: string, identityType: string, value: string): string {
    const validator = this.getValidator(country, identityType);
    return validator ? validator.format(value) : value;
  }

  /**
   * Get all registered validators
   * @returns Array of all validators
   */
  static getAllValidators(): IIdentityValidator[] {
    return Array.from(this.validators.values());
  }

  /**
   * Get validators for a specific country
   * @param country ISO 3166-1 alpha-2 country code
   * @returns Array of validators for the country
   */
  static getValidatorsByCountry(country: string): IIdentityValidator[] {
    return Array.from(this.validators.values()).filter((v) => v.country === country);
  }

  /**
   * Check if a validator exists
   * @param country ISO 3166-1 alpha-2 country code
   * @param identityType The identity document type
   * @returns True if validator exists
   */
  static hasValidator(country: string, identityType: string): boolean {
    const key = this.createKey(country, identityType);
    return this.validators.has(key);
  }

  /**
   * Create a unique key for the validator map
   * @param country Country code
   * @param identityType Identity type
   * @returns Composite key
   */
  private static createKey(country: string, identityType: string): string {
    return `${country.toUpperCase()}:${identityType.toLowerCase()}`;
  }
}

// Initialize with default validators
IdentityValidationRegistry.initialize();
