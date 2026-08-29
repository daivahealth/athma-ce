import { describe, expect, it, beforeAll } from '@jest/globals';
import { IdentityValidationRegistry } from '../identity-validation.registry';
import { verhoeffCheckDigit, isValidVerhoeff } from '../verhoeff';

/** Builds a checksum-valid number by computing the real check digit. */
function withVerhoeff(base: string): string {
  return base + verhoeffCheckDigit(base);
}

describe('verhoeff', () => {
  it('round-trips its own check digit', () => {
    const value = withVerhoeff('23412341234');
    expect(isValidVerhoeff(value)).toBe(true);
  });

  it('detects single-digit corruption', () => {
    const value = withVerhoeff('23412341234');
    const corrupted = value.replace(/^2/, '3');
    expect(isValidVerhoeff(corrupted)).toBe(false);
  });
});

describe('IdentityValidationRegistry', () => {
  beforeAll(() => IdentityValidationRegistry.initialize());

  it('accepts a checksum-valid ABHA number', () => {
    const abha = withVerhoeff('9100000002346'); // 14 digits total
    const result = IdentityValidationRegistry.validate('IN', 'abha', abha);
    expect(result.isValid).toBe(true);
  });

  it('rejects an ABHA number with a bad checksum', () => {
    const abha = withVerhoeff('9100000002346');
    const corrupted = abha.slice(0, -1) + ((Number(abha.slice(-1)) + 1) % 10);
    expect(IdentityValidationRegistry.validate('IN', 'abha', corrupted).isValid).toBe(false);
  });

  it('rejects non-numeric ABHA input', () => {
    const result = IdentityValidationRegistry.validate('IN', 'abha', 'garbage!!');
    expect(result.isValid).toBe(false);
    expect((result.errors ?? []).length).toBeGreaterThan(0);
  });

  it('accepts a checksum-valid Aadhaar', () => {
    // Aadhaar cannot start with 0/1; verhoeff over 12 digits.
    const aadhaar = withVerhoeff('23412341234');
    expect(IdentityValidationRegistry.validate('IN', 'aadhaar', aadhaar).isValid).toBe(true);
  });

  it('rejects a wrong-length Emirates ID', () => {
    expect(IdentityValidationRegistry.validate('AE', 'emirates_id', '784-1234').isValid).toBe(false);
  });

  it('reports unknown country/type combinations as invalid rather than throwing', () => {
    const result = IdentityValidationRegistry.validate('ZZ', 'mystery', 'anything');
    expect(result.isValid).toBe(false);
  });

  it('validates passports under the INTL registration', () => {
    expect(IdentityValidationRegistry.hasValidator('INTL', 'passport')).toBe(true);
    expect(IdentityValidationRegistry.validate('INTL', 'passport', 'M1234567').isValid).toBe(true);
  });
});
