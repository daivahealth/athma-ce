// Run: npm test (in plugins/oncology) — uses node:test via tsx from backend/node_modules.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ilikeAny, InvalidPagingError, likePattern, MAX_PAGE_LIMIT, parsePaging } from './pagination';

describe('parsePaging', () => {
  it('defaults to page 1 and the endpoint default limit', () => {
    assert.deepEqual(parsePaging(undefined, undefined), { page: 1, limit: 20, offset: 0 });
    assert.deepEqual(parsePaging('', '', 50), { page: 1, limit: 50, offset: 0 });
  });

  it('computes the offset for later pages', () => {
    assert.deepEqual(parsePaging('3', '20'), { page: 3, limit: 20, offset: 40 });
  });

  it('floors page and limit at 1', () => {
    assert.deepEqual(parsePaging('0', '0'), { page: 1, limit: 1, offset: 0 });
    assert.deepEqual(parsePaging('-4', '-10'), { page: 1, limit: 1, offset: 0 });
  });

  it(`clamps limit to ${MAX_PAGE_LIMIT}`, () => {
    assert.equal(parsePaging('1', '500').limit, 500);
    assert.equal(parsePaging('1', '100000').limit, MAX_PAGE_LIMIT);
  });

  it('rejects non-integer input instead of passing NaN to SQL', () => {
    for (const bad of ['abc', '1.5', '2abc', 'NaN', '1e3']) {
      assert.throws(() => parsePaging(bad, undefined), InvalidPagingError, `page=${bad}`);
      assert.throws(() => parsePaging(undefined, bad), InvalidPagingError, `limit=${bad}`);
    }
  });
});

describe('likePattern', () => {
  it('wraps the term for a contains match', () => {
    assert.equal(likePattern('smith'), '%smith%');
  });

  it('escapes LIKE wildcards and backslashes so they match literally', () => {
    assert.equal(likePattern('50%_a\\b'), '%50\\%\\_a\\\\b%');
  });
});

describe('ilikeAny', () => {
  it('ORs every column against one placeholder', () => {
    assert.equal(ilikeAny(['p.mrn', 'cd.cancer_type'], '$3'), '(p.mrn ILIKE $3 OR cd.cancer_type ILIKE $3)');
  });

  it('refuses anything but a positional placeholder', () => {
    assert.throws(() => ilikeAny(['p.mrn'], "'x' OR 1=1"));
    assert.throws(() => ilikeAny([], '$2'));
  });
});
