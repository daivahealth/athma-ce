import { pageCount, pageOffset } from './list-pagination';

describe('pageCount', () => {
  it('rounds up partial pages', () => {
    expect(pageCount(41, 20)).toBe(3);
    expect(pageCount(40, 20)).toBe(2);
  });

  it('is at least 1 for empty lists or bad sizes', () => {
    expect(pageCount(0, 20)).toBe(1);
    expect(pageCount(10, 0)).toBe(1);
  });
});

describe('pageOffset', () => {
  it('converts a 1-based page to a row offset', () => {
    expect(pageOffset(1, 20)).toBe(0);
    expect(pageOffset(3, 20)).toBe(40);
    expect(pageOffset(0, 20)).toBe(0);
  });
});
