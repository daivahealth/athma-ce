/**
 * Format a document number using a pattern with token replacement.
 *
 * Supported tokens:
 *  - {PREFIX}      Replaced with the prefix string (e.g. "INV", "RCPT")
 *  - {YEAR}        Replaced with the current 4-digit year
 *  - {SEQUENCE:N}  Replaced with the sequence number, zero-padded to N digits
 *  - {SEQUENCE}    Replaced with the sequence number (no padding)
 *
 * The sequence is calculated as: count + startNumber
 *   where `count` is the number of existing documents for the tenant.
 *
 * Example:
 *   formatDocumentNumber('{PREFIX}-{YEAR}-{SEQUENCE:6}', 'INV', 1000, 1)
 *   => 'INV-2026-001001'
 */
export function formatDocumentNumber(
  format: string,
  prefix: string,
  startNumber: number,
  count: number,
): string {
  const year = new Date().getFullYear().toString();
  const sequence = count + startNumber;

  let result = format;
  result = result.replace('{PREFIX}', prefix);
  result = result.replace('{YEAR}', year);

  const seqMatch = result.match(/\{SEQUENCE:(\d+)\}/);
  if (seqMatch) {
    const pad = parseInt(seqMatch[1], 10);
    result = result.replace(seqMatch[0], String(sequence).padStart(pad, '0'));
  } else {
    result = result.replace('{SEQUENCE}', String(sequence));
  }

  return result;
}
