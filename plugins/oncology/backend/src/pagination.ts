/**
 * Query-string paging and search helpers for oncology list endpoints. Kept free of Nest imports
 * so it can be unit-tested with node:test; controllers turn the error into a
 * 400.
 */

/** Largest page a list endpoint will return (pickers ask for up to this). */
export const MAX_PAGE_LIMIT = 500;

export class InvalidPagingError extends Error {}

export interface Paging {
  page: number;
  limit: number;
  /** Rows to skip for this page. */
  offset: number;
}

function parsePositiveInt(raw: string | undefined, name: string): number | undefined {
  if (raw === undefined || raw === '') return undefined;
  const trimmed = String(raw).trim();
  if (!/^-?\d+$/.test(trimmed)) throw new InvalidPagingError(`${name} must be an integer`);
  return Number(trimmed);
}

/**
 * Parses `page` / `limit` query values. Missing values fall back to page 1
 * and `defaultLimit`; page is floored at 1 and limit clamped to
 * 1..MAX_PAGE_LIMIT. Non-integer input (e.g. "abc", "1.5") throws.
 */
export function parsePaging(page: string | undefined, limit: string | undefined, defaultLimit = 20): Paging {
  const p = Math.max(1, parsePositiveInt(page, 'page') ?? 1);
  const l = Math.min(MAX_PAGE_LIMIT, Math.max(1, parsePositiveInt(limit, 'limit') ?? defaultLimit));
  return { page: p, limit: l, offset: (p - 1) * l };
}

/**
 * `%term%` for ILIKE with the term's own `%`, `_` and `\` matched literally,
 * so a search for "50%" does not act as a wildcard. Always pass the result
 * as a bound parameter, never interpolated into SQL.
 */
export function likePattern(term: string): string {
  return `%${term.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
}

/** Patient columns a list search matches on (requires `public.patients p`). */
export const PATIENT_SEARCH_COLUMNS = [
  'p.mrn', 'p.display_name', 'p.first_name', 'p.last_name', "CONCAT(p.first_name, ' ', p.last_name)",
] as const;

/**
 * `(col1 ILIKE $n OR col2 ILIKE $n ...)` against one bound placeholder.
 * Columns are fixed SQL expressions from code; the placeholder must be a
 * positional parameter, so user input can only arrive through bind values.
 */
export function ilikeAny(columns: readonly string[], placeholder: string): string {
  if (!/^\$\d+$/.test(placeholder)) throw new Error(`Invalid SQL placeholder: ${placeholder}`);
  if (columns.length === 0) throw new Error('ilikeAny needs at least one column');
  return `(${columns.map((c) => `${c} ILIKE ${placeholder}`).join(' OR ')})`;
}
