import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

// Phase-based chemo protocol regimen (schema v2).
// Mirrors frontend/src/plugins/oncology/lib/protocol-phases.ts — keep in step.
//
// `chemo_protocols.phases` is the source of truth. `regimen`, `total_cycles`
// and `cycle_duration_days` are derived on write so legacy readers keep
// working. Rows saved before v2 have `phases = []` and are lifted into a
// single phase on read.

export interface ProtocolDrugOverride {
  cycles: number[];
  dose?: number;
  unit?: string;
  days?: number[];
  infusionDurationMin?: number;
  omit?: boolean;
  note?: string;
}

export interface ProtocolPhaseDrug {
  id: string;
  drug: string;
  dose: number;
  unit: string;
  route: string;
  days: number[];
  doseFormula: string;
  infusionDurationMin?: number;
  diluent?: string;
  maxDose?: number;
  doseLevels?: { level: number; dose: number }[];
  overrides?: ProtocolDrugOverride[];
}

export interface ProtocolPhase {
  id: string;
  name: string;
  cycles: number;
  cycleDurationDays: number;
  drugs: ProtocolPhaseDrug[];
  notes?: string;
}

const toDays = (day: unknown): number[] => {
  if (Array.isArray(day)) return day.map(Number).filter((d) => d > 0);
  const n = Number(day);
  return n > 0 ? [n] : [1];
};

const toNums = (v: unknown): number[] =>
  Array.isArray(v) ? [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n > 0))].sort((a, b) => a - b) : [];

const optNum = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** v1 flat regimen → one phase covering every cycle. */
export function phasesFromLegacy(row: { regimen?: unknown; total_cycles?: number; cycle_duration_days?: number }): ProtocolPhase[] {
  const regimen = Array.isArray(row.regimen) ? (row.regimen as Record<string, any>[]) : [];
  if (!regimen.length) return [];
  return [{
    id: randomUUID(),
    name: 'Main',
    cycles: row.total_cycles || 1,
    cycleDurationDays: row.cycle_duration_days || 21,
    drugs: regimen.map((r) => ({
      id: randomUUID(),
      drug: String(r.drug ?? ''),
      dose: Number(r.dose) || 0,
      unit: r.unit ?? 'mg/m²',
      route: r.route ?? 'IV',
      days: toDays(r.day),
      doseFormula: r.doseFormula ?? 'bsa',
      infusionDurationMin: optNum(r.infusionDurationMin),
      diluent: r.diluent ?? undefined,
    })),
  }];
}

/** API shape for a protocol row: always carries `phases` and `supportive_care`. */
export function normalizeProtocolRow<T extends Record<string, any>>(row: T): T & { phases: ProtocolPhase[]; supportive_care: unknown } {
  const phases = Array.isArray(row.phases) && row.phases.length ? row.phases : phasesFromLegacy(row);
  // The column is "supportiveCare" (no @map in schema.prisma); expose it the
  // way the rest of the row is named.
  const supportive_care = row.supportive_care ?? row.supportiveCare ?? [];
  return { ...row, phases, supportive_care };
}

/** Sanitises and validates client-supplied phases; throws 400 on clinical-shape errors. */
export function parsePhases(input: unknown): ProtocolPhase[] {
  if (!Array.isArray(input)) throw new BadRequestException('phases must be an array');
  const errors: string[] = [];
  const phases: ProtocolPhase[] = input.map((raw: any, i: number) => {
    const name = String(raw?.name ?? '').trim() || `Phase ${i + 1}`;
    const cycles = Number(raw?.cycles);
    const cycleDurationDays = Number(raw?.cycleDurationDays);
    if (!Number.isInteger(cycles) || cycles < 1) errors.push(`${name}: cycles must be a whole number ≥ 1`);
    if (!Number.isInteger(cycleDurationDays) || cycleDurationDays < 1) errors.push(`${name}: cycle length must be ≥ 1 day`);
    const drugs: ProtocolPhaseDrug[] = (Array.isArray(raw?.drugs) ? raw.drugs : [])
      .filter((d: any) => String(d?.drug ?? '').trim())
      .map((d: any) => {
        const drug = String(d.drug).trim();
        const dose = Number(d.dose);
        const days = toNums(d.days);
        if (!(dose > 0)) errors.push(`${name} · ${drug}: dose must be > 0`);
        if (!days.length) errors.push(`${name} · ${drug}: at least one day is required`);
        const overrides: ProtocolDrugOverride[] = (Array.isArray(d.overrides) ? d.overrides : [])
          .map((o: any) => ({
            cycles: toNums(o?.cycles),
            dose: optNum(o?.dose),
            unit: o?.unit || undefined,
            days: toNums(o?.days).length ? toNums(o?.days) : undefined,
            infusionDurationMin: optNum(o?.infusionDurationMin),
            omit: o?.omit === true ? true : undefined,
            note: o?.note ? String(o.note) : undefined,
          }))
          .filter((o: ProtocolDrugOverride) => o.cycles.length);
        for (const day of [...days, ...overrides.flatMap((o) => o.days ?? [])]) {
          if (day > cycleDurationDays) { errors.push(`${name} · ${drug}: day ${day} exceeds the ${cycleDurationDays}-day cycle`); break; }
        }
        const outOfRange = overrides.flatMap((o) => o.cycles).find((c) => c > cycles);
        if (outOfRange) errors.push(`${name} · ${drug}: override cycle ${outOfRange} is outside the phase (1–${cycles})`);
        return {
          id: typeof d.id === 'string' && d.id ? d.id : randomUUID(),
          drug,
          dose,
          unit: d.unit ?? 'mg/m²',
          route: d.route ?? 'IV',
          days,
          doseFormula: d.doseFormula ?? 'bsa',
          infusionDurationMin: optNum(d.infusionDurationMin),
          diluent: d.diluent || undefined,
          maxDose: optNum(d.maxDose),
          doseLevels: (Array.isArray(d.doseLevels) ? d.doseLevels : [])
            .map((l: any) => ({ level: Number(l?.level), dose: Number(l?.dose) }))
            .filter((l: { level: number; dose: number }) => l.level < 0 && l.dose > 0),
          overrides,
        };
      });
    if (!drugs.length) errors.push(`${name}: at least one drug is required`);
    return {
      id: typeof raw?.id === 'string' && raw.id ? raw.id : randomUUID(),
      name, cycles, cycleDurationDays, drugs,
      notes: raw?.notes ? String(raw.notes) : undefined,
    };
  });
  if (!phases.length) errors.push('at least one phase is required');
  if (errors.length) throw new BadRequestException({ message: 'Invalid protocol phases', errors });
  return phases;
}

/** Derived legacy columns for a v2 regimen. */
export function deriveLegacyColumns(phases: ProtocolPhase[]) {
  return {
    regimen: phases.flatMap((ph) => ph.drugs.map((d) => ({
      drug: d.drug, dose: d.dose, unit: d.unit, route: d.route,
      day: d.days.length === 1 ? d.days[0] : d.days,
      doseFormula: d.doseFormula, infusionDurationMin: d.infusionDurationMin, diluent: d.diluent,
      phase: ph.name,
    }))),
    totalCycles: phases.reduce((s, ph) => s + ph.cycles, 0),
    cycleDurationDays: phases[0].cycleDurationDays,
  };
}

/** Drugs (with cycle-specific dose/days applied, omitted ones removed) for an absolute cycle. */
export function regimenForCycle(phases: ProtocolPhase[], cycle: number) {
  let start = 1;
  for (const ph of phases) {
    if (cycle >= start && cycle < start + ph.cycles) {
      const pc = cycle - start + 1;
      return ph.drugs.flatMap((d) => {
        let dose = d.dose; let unit = d.unit; let days = d.days; let omit = false; let note: string | undefined;
        let infusionDurationMin = d.infusionDurationMin;
        for (const o of d.overrides ?? []) {
          if (!o.cycles.includes(pc)) continue;
          if (o.dose != null) dose = o.dose;
          if (o.unit) unit = o.unit;
          if (o.days?.length) days = o.days;
          if (o.infusionDurationMin != null) infusionDurationMin = o.infusionDurationMin;
          if (o.omit != null) omit = o.omit;
          if (o.note) note = o.note;
        }
        if (omit) return [];
        return [{
          drug: d.drug, dose, unit, route: d.route, day: days.length === 1 ? days[0] : days,
          doseFormula: d.doseFormula, infusionDurationMin, diluent: d.diluent,
          maxDose: d.maxDose, phase: ph.name, phaseCycle: pc, note,
        }];
      });
    }
    start += ph.cycles;
  }
  return null;
}
