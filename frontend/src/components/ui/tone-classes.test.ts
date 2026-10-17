import { toneOf } from './tone-classes';

describe('toneOf', () => {
  const map = { a: 'sky', b: 'rose' } as const;

  it('returns the mapped tone', () => {
    expect(toneOf(map, 'a')).toBe('sky');
    expect(toneOf(map, 'b')).toBe('rose');
  });

  it('falls back to slate for unknown, empty and missing values', () => {
    expect(toneOf(map, 'zzz')).toBe('slate');
    expect(toneOf(map, '')).toBe('slate');
    expect(toneOf(map, null)).toBe('slate');
    expect(toneOf(map, undefined)).toBe('slate');
  });

  it('does not treat inherited object keys as known values', () => {
    expect(toneOf(map, 'toString')).toBe('slate');
    expect(toneOf(map, 'constructor')).toBe('slate');
  });

  it('honours an explicit fallback', () => {
    expect(toneOf(map, 'zzz', 'amber')).toBe('amber');
  });
});
