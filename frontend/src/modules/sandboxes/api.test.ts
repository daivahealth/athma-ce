import { daysLeft, ORGANISATION_TYPES, SANDBOX_DEFAULT_MODULES, SANDBOX_MODULES } from './api';

describe('sandbox module defaults', () => {
  it('covers every organisation type with known modules', () => {
    const known = SANDBOX_MODULES.map((item) => item.value as string);
    for (const type of ORGANISATION_TYPES) {
      const defaults = SANDBOX_DEFAULT_MODULES[type.value];
      expect(defaults).toBeDefined();
      for (const value of defaults) expect(known).toContain(value);
    }
  });

  it('keeps inpatient and oncology out of a clinic by default', () => {
    expect(SANDBOX_DEFAULT_MODULES.clinic).not.toContain('inpatient');
    expect(SANDBOX_DEFAULT_MODULES.clinic).not.toContain('oncology');
    expect(SANDBOX_DEFAULT_MODULES.cancer_centre).toContain('oncology');
  });
});

describe('daysLeft', () => {
  const now = new Date('2026-11-08T12:00:00Z');

  it('counts a part day as a day', () => {
    expect(daysLeft('2026-12-08T11:59:00Z', now)).toBe(30);
    expect(daysLeft('2026-11-08T13:00:00Z', now)).toBe(1);
  });

  it('is 0 once expired and null without a date', () => {
    expect(daysLeft('2026-11-07T12:00:00Z', now)).toBe(0);
    expect(daysLeft(null, now)).toBeNull();
  });
});
