import { MAX_LIST_LIMIT, isUuid, normalizeSearch, resolvePaging } from './list-query';

describe('list-query', () => {
  it('uses the default limit and zero offset when none are given', () => {
    expect(resolvePaging(undefined, undefined)).toEqual({ take: 50, skip: 0 });
    expect(resolvePaging(undefined, undefined, 100)).toEqual({ take: 100, skip: 0 });
  });

  it('clamps the limit to MAX_LIST_LIMIT and floors bad values', () => {
    expect(resolvePaging(5000, 40)).toEqual({ take: MAX_LIST_LIMIT, skip: 40 });
    expect(resolvePaging(0, -3)).toEqual({ take: 50, skip: 0 });
    expect(resolvePaging(Number.NaN, Number.NaN)).toEqual({ take: 50, skip: 0 });
    expect(resolvePaging(20.7, 20.2)).toEqual({ take: 20, skip: 20 });
  });

  it('trims search terms and drops blank ones', () => {
    expect(normalizeSearch('  CLM-1 ')).toBe('CLM-1');
    expect(normalizeSearch('   ')).toBeUndefined();
    expect(normalizeSearch(undefined)).toBeUndefined();
    expect(normalizeSearch('x'.repeat(500))).toHaveLength(100);
  });

  it('recognises uuids only', () => {
    expect(isUuid('3f2b1c9e-8d4a-4b6f-9c1e-2a7d5e8f0b13')).toBe(true);
    expect(isUuid('CLM-2026-0001')).toBe(false);
  });
});
