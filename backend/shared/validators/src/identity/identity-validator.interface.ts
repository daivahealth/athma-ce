/**
 * Identity Validator Interface
 *
 * Defines the contract for country-specific identity document validators.
 * Each validator implements validation logic for a specific identity type.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  normalizedValue?: string;
}

export interface IdentityMetadata {
  country: string;
  identityType: string;
  label: {
    en: string;
    ar: string;
  };
  format?: string;
  example?: string;
  requiresExpiry?: boolean;
  isGovernmentIssued?: boolean;
}

export interface IIdentityValidator {
  /**
   * The ISO 3166-1 alpha-2 country code (e.g., 'AE', 'IN', 'SG')
   */
  readonly country: string;

  /**
   * The identity document type (e.g., 'emirates_id', 'aadhaar', 'passport')
   */
  readonly identityType: string;

  /**
   * Metadata about this identity type
   */
  readonly metadata: IdentityMetadata;

  /**
   * Validates the identity document number
   * @param value The identity document number to validate
   * @returns Validation result with errors and normalized value
   */
  validate(value: string): ValidationResult;

  /**
   * Formats/normalizes the identity value to a standard format
   * @param value The raw identity value
   * @returns Formatted identity value
   */
  format(value: string): string;

  /**
   * Validates the checksum/check digit if applicable
   * @param value The identity document number
   * @returns True if checksum is valid
   */
  validateChecksum?(value: string): boolean;

  /**
   * Extracts metadata from the identity number (e.g., DOB, gender)
   * @param value The identity document number
   * @returns Extracted metadata
   */
  extractMetadata?(value: string): Record<string, any>;
}
