/**
 * Shared paging / search helpers for RCM list endpoints. Every list returns
 * `{ <rows>, total }` where `total` counts all rows matching the filters, so
 * screens can page with limit/offset instead of silently showing page one.
 */

/** Hard ceiling on rows per list request, whatever the caller asks for. */
export const MAX_LIST_LIMIT = 200;

/** Max length accepted for a free-text `search` query parameter. */
export const MAX_SEARCH_LENGTH = 100;

/**
 * Prisma `take` / `skip` from optional limit/offset: limit falls back to
 * `defaultLimit` and is clamped to 1..MAX_LIST_LIMIT; offset is floored at 0.
 */
export function resolvePaging(
  limit: number | undefined | null,
  offset: number | undefined | null,
  defaultLimit = 50,
): { take: number; skip: number } {
  const requested = Number.isFinite(limit as number) && (limit as number) > 0 ? Math.floor(limit as number) : defaultLimit;
  const take = Math.min(Math.max(1, requested), MAX_LIST_LIMIT);
  const skip = Number.isFinite(offset as number) && (offset as number) > 0 ? Math.floor(offset as number) : 0;
  return { take, skip };
}

/** Trimmed search term, or undefined when blank. */
export function normalizeSearch(search: string | undefined | null): string | undefined {
  const term = search?.trim();
  return term ? term.slice(0, MAX_SEARCH_LENGTH) : undefined;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when `value` is a UUID, i.e. safe to compare against a uuid column. */
export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/** Case-insensitive `contains` condition for a Prisma string column. */
export function containsInsensitive(term: string) {
  return { contains: term, mode: 'insensitive' as const };
}
