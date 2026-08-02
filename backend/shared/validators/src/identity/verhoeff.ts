/**
 * Verhoeff check-digit algorithm.
 *
 * Used by both UIDAI Aadhaar numbers (12 digits) and NHA/ABDM ABHA numbers
 * (14 digits), so the tables live here rather than being duplicated per
 * validator.
 *
 * @see https://en.wikipedia.org/wiki/Verhoeff_algorithm
 */

/** Multiplication table (dihedral group D5). */
const D: readonly (readonly number[])[] = [
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

/** Permutation table. */
const P: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/** Multiplicative inverse table. */
const INV: readonly number[] = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validate a numeric string (digits only) whose final digit is a Verhoeff
 * check digit. Returns false for empty or non-numeric input.
 */
export function isValidVerhoeff(digits: string): boolean {
  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let c = 0;
  const reversed = digits.split('').map(Number).reverse();

  for (let i = 0; i < reversed.length; i++) {
    c = D[c]![P[i % 8]![reversed[i]!]!]!;
  }

  return c === 0;
}

/**
 * Compute the Verhoeff check digit for a payload that does not yet include
 * one. Primarily useful for generating valid test fixtures.
 */
export function verhoeffCheckDigit(payload: string): number {
  if (!/^\d+$/.test(payload)) {
    throw new Error('Verhoeff payload must contain only digits');
  }

  let c = 0;
  const reversed = payload.split('').map(Number).reverse();

  for (let i = 0; i < reversed.length; i++) {
    c = D[c]![P[(i + 1) % 8]![reversed[i]!]!]!;
  }

  return INV[c]!;
}
