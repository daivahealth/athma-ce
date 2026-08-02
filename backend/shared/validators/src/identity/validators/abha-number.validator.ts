import {
  IIdentityValidator,
  ValidationResult,
  IdentityMetadata,
} from '../identity-validator.interface';
import { isValidVerhoeff } from '../verhoeff';

/**
 * ABHA Number Validator (India — NHA / ABDM)
 *
 * The ABHA (Ayushman Bharat Health Account) number, formerly "Health ID", is a
 * 14-digit number displayed as XX-XXXX-XXXX-XXXX. Like Aadhaar it carries a
 * Verhoeff check digit in the final position.
 *
 * NOTE: this validates the *format* of an ABHA number only. Proving that the
 * number exists and belongs to the person in front of you requires an online
 * OTP verification against ABDM — see the AbhaProvider in the clinical service.
 *
 * @see https://abdm.gov.in/
 */
export class AbhaNumberValidator implements IIdentityValidator {
  readonly country = 'IN';
  readonly identityType = 'abha';
  readonly metadata: IdentityMetadata = {
    country: 'IN',
    identityType: 'abha',
    label: {
      en: 'ABHA Number',
      ar: 'رقم ABHA',
    },
    format: 'XX-XXXX-XXXX-XXXX',
    example: '91-1111-1111-1111',
    requiresExpiry: false,
    isGovernmentIssued: true,
  };

  validate(value: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      return { isValid: false, errors: ['ABHA number is required'] };
    }

    const clean = value.replace(/[\s-]/g, '');

    if (!/^\d+$/.test(clean)) {
      errors.push('ABHA number must contain only numbers');
    }

    if (clean.length !== 14) {
      errors.push('ABHA number must be 14 digits long');
    }

    if (clean.length === 14 && /^\d+$/.test(clean) && !isValidVerhoeff(clean)) {
      errors.push('Invalid ABHA number check digit');
    }

    return {
      isValid: errors.length === 0,
      errors,
      normalizedValue: errors.length === 0 ? this.format(clean) : undefined,
    };
  }

  /** Formats to the canonical XX-XXXX-XXXX-XXXX display form. */
  format(value: string): string {
    const clean = value.replace(/\D/g, '');
    if (clean.length !== 14) {
      return value;
    }
    return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}-${clean.slice(10)}`;
  }

  validateChecksum(value: string): boolean {
    const clean = value.replace(/\D/g, '');
    return clean.length === 14 && isValidVerhoeff(clean);
  }

  extractMetadata(value: string): Record<string, any> {
    const clean = value.replace(/\D/g, '');
    if (clean.length !== 14) {
      return {};
    }
    return {
      // Only the last 4 digits are ever surfaced for display.
      maskedValue: `XX-XXXX-XXXX-${clean.slice(10)}`,
    };
  }
}

/**
 * Validates an ABHA address (the human-readable PHR handle, e.g.
 * `someone@sbx`). This is not a registry-backed identity type of its own — it
 * is stored alongside the ABHA number — so it is exposed as a helper rather
 * than an IIdentityValidator.
 *
 * Rules applied (per NHA guidance): 4-32 character local part, must start with
 * a letter, may contain letters/digits/dot/underscore, no leading, trailing or
 * consecutive separators. The suffix is environment-specific (`sbx` in
 * sandbox, `abdm` in production) so it is accepted rather than pinned here.
 */
export function validateAbhaAddress(value: string): ValidationResult {
  const errors: string[] = [];

  if (!value || value.trim() === '') {
    return { isValid: false, errors: ['ABHA address is required'] };
  }

  const trimmed = value.trim().toLowerCase();
  const parts = trimmed.split('@');

  if (parts.length !== 2 || !parts[1]) {
    return { isValid: false, errors: ['ABHA address must be in the form username@suffix'] };
  }

  const local = parts[0]!;

  if (local.length < 4 || local.length > 32) {
    errors.push('ABHA address username must be between 4 and 32 characters');
  }
  if (!/^[a-z]/.test(local)) {
    errors.push('ABHA address username must start with a letter');
  }
  if (!/^[a-z0-9._]+$/.test(local)) {
    errors.push('ABHA address username may only contain letters, numbers, dots and underscores');
  }
  if (/[._]$/.test(local)) {
    errors.push('ABHA address username must not end with a dot or underscore');
  }
  if (/[._]{2,}/.test(local)) {
    errors.push('ABHA address username must not contain consecutive dots or underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedValue: errors.length === 0 ? trimmed : undefined,
  };
}
