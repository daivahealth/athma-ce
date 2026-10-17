import type { ProtocolPhase } from '@/plugins/oncology/types';
import {
  buildMatrix, buildRelativeSchedule, flattenToRegimen, formatNumberList, parseNumberList,
  phasesFromLegacy, resolveCycle, setCycleOverride, totalCycles, validatePhases,
} from './protocol-phases';

const drug = (id: string, name: string, dose: number, extra: Partial<ProtocolPhase['drugs'][number]> = {}) => ({
  id, drug: name, dose, unit: 'mg/m²', route: 'IV', days: [1], doseFormula: 'bsa' as const, ...extra,
});

const acT: ProtocolPhase[] = [
  { id: 'ac', name: 'AC', cycles: 4, cycleDurationDays: 14, drugs: [drug('dox', 'Doxorubicin', 60), drug('cyc', 'Cyclophosphamide', 600)] },
  { id: 't', name: 'Paclitaxel', cycles: 4, cycleDurationDays: 14, drugs: [drug('pac', 'Paclitaxel', 175)] },
];

const tch: ProtocolPhase[] = [
  {
    id: 'tch', name: 'TCH', cycles: 6, cycleDurationDays: 21,
    drugs: [drug('tras', 'Trastuzumab', 6, { unit: 'mg/kg', doseFormula: 'weight', infusionDurationMin: 30, overrides: [{ cycles: [1], dose: 8, infusionDurationMin: 90, note: 'loading' }] })],
  },
  { id: 'm', name: 'Maintenance', cycles: 11, cycleDurationDays: 21, drugs: [drug('tras-m', 'Trastuzumab', 6, { unit: 'mg/kg', doseFormula: 'weight' })] },
];

describe('protocol phases', () => {
  it('gives each cycle only its own phase drugs', () => {
    expect(totalCycles(acT)).toBe(8);
    expect(resolveCycle(acT, 4)!.drugs.map((d) => d.drug)).toEqual(['Doxorubicin', 'Cyclophosphamide']);
    expect(resolveCycle(acT, 5)!.drugs.map((d) => d.drug)).toEqual(['Paclitaxel']);
    expect(resolveCycle(acT, 5)!.phaseCycle).toBe(1);
    expect(resolveCycle(acT, 9)).toBeUndefined();
  });

  it('applies cycle overrides only to the cycles listed', () => {
    expect(resolveCycle(tch, 1)!.drugs[0]).toMatchObject({ dose: 8, infusionDurationMin: 90, overridden: true, note: 'loading' });
    expect(resolveCycle(tch, 2)!.drugs[0]).toMatchObject({ dose: 6, infusionDurationMin: 30, overridden: false });
    expect(resolveCycle(tch, 7)!.phase.name).toBe('Maintenance');
  });

  it('builds a matrix with one row per drug name across phases', () => {
    const { cycles, rows } = buildMatrix(tch);
    expect(cycles).toHaveLength(17);
    expect(rows).toHaveLength(1);
    expect(rows[0].cells.every(Boolean)).toBe(true);
    const ac = buildMatrix(acT);
    const pac = ac.rows.find((r) => r.drug === 'Paclitaxel')!;
    expect(pac.cells.slice(0, 4)).toEqual([null, null, null, null]);
  });

  it('counts schedule days across phases with different cycle lengths', () => {
    const phases: ProtocolPhase[] = [
      { id: 'a', name: 'A', cycles: 2, cycleDurationDays: 28, drugs: [drug('x', 'X', 1, { days: [1, 15] })] },
      { id: 'b', name: 'B', cycles: 1, cycleDurationDays: 21, drugs: [drug('y', 'Y', 1, { days: [1, 8] })] },
    ];
    expect(buildRelativeSchedule(phases).map((d) => [d.treatmentDay, d.cycle, d.cycleDay])).toEqual([
      [1, 1, 1], [15, 1, 15], [29, 2, 1], [43, 2, 15], [57, 3, 1], [64, 3, 8],
    ]);
  });

  it('drops omitted drugs from the schedule', () => {
    const omitted = [{ ...acT[0], drugs: [setCycleOverride(acT[0].drugs[0], 2, { omit: true }), acT[0].drugs[1]] }];
    const day = buildRelativeSchedule(omitted).find((d) => d.cycle === 2)!;
    expect(day.drugs.map((d) => d.drug)).toEqual(['Cyclophosphamide']);
  });

  it('setCycleOverride splits a multi-cycle override', () => {
    const line = drug('p', 'P', 100, { overrides: [{ cycles: [1, 2, 3], dose: 80 }] });
    const next = setCycleOverride(line, 2, null);
    expect(next.overrides).toEqual([{ cycles: [1, 3], dose: 80 }]);
  });

  it('lifts a legacy flat regimen into one phase, keeping multi-day schedules', () => {
    const phases = phasesFromLegacy({
      regimen: [{ drug: 'Doxorubicin', dose: 25, unit: 'mg/m²', route: 'IV', day: [1, 15], doseFormula: 'bsa' }],
      total_cycles: 6, cycle_duration_days: 28,
    });
    expect(phases).toHaveLength(1);
    expect(phases[0]).toMatchObject({ cycles: 6, cycleDurationDays: 28 });
    expect(phases[0].drugs[0].days).toEqual([1, 15]);
    expect(flattenToRegimen(phases)[0].day).toEqual([1, 15]);
  });

  it('validates days beyond the cycle and out-of-range overrides', () => {
    const bad: ProtocolPhase[] = [{
      id: 'a', name: 'A', cycles: 2, cycleDurationDays: 14,
      drugs: [drug('x', 'X', 1, { days: [15], overrides: [{ cycles: [3], dose: 2 }] })],
    }];
    const errors = validatePhases(bad);
    expect(errors.some((e) => e.includes('day 15'))).toBe(true);
    expect(errors.some((e) => e.includes('cycle 3'))).toBe(true);
    expect(validatePhases(acT)).toEqual([]);
  });

  it('parses and formats number lists', () => {
    expect(parseNumberList('1-4, 8 ,15')).toEqual([1, 2, 3, 4, 8, 15]);
    expect(parseNumberList('3–1')).toEqual([1, 2, 3]);
    expect(formatNumberList([1, 2, 3, 4, 8, 15])).toBe('1–4, 8, 15');
    expect(formatNumberList([1, 2])).toBe('1, 2');
  });
});
