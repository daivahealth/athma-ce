import type {
  ChemoProtocol, ProtocolPhase, ProtocolPhaseDrug, ProtocolDrugOverride, RegimenItem,
} from '@/plugins/oncology/types';

// Phase-based protocol helpers (schema v2). The backend mirrors normalize /
// flatten / validate in plugins/oncology/backend/src/protocol-phases.ts — keep
// the two in step.

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const emptyPhaseDrug = (): ProtocolPhaseDrug => ({
  id: newId(), drug: '', dose: 0, unit: 'mg/m²', route: 'IV', days: [1], doseFormula: 'bsa',
});

export const emptyPhase = (index: number, cycleDurationDays = 21): ProtocolPhase => ({
  id: newId(), name: `Phase ${index + 1}`, cycles: 4, cycleDurationDays, drugs: [emptyPhaseDrug()],
});

const toDays = (day: unknown): number[] => {
  if (Array.isArray(day)) return day.map(Number).filter((d) => d > 0);
  const n = Number(day);
  return n > 0 ? [n] : [1];
};

/** v1 → v2: a flat regimen becomes one phase spanning every cycle. */
export function phasesFromLegacy(p: Pick<ChemoProtocol, 'regimen' | 'total_cycles' | 'cycle_duration_days'>): ProtocolPhase[] {
  const regimen = p.regimen ?? [];
  if (!regimen.length) return [];
  return [{
    id: newId(),
    name: 'Main',
    cycles: p.total_cycles || 1,
    cycleDurationDays: p.cycle_duration_days || 21,
    drugs: regimen.map((r) => ({
      id: newId(),
      drug: r.drug,
      dose: Number(r.dose) || 0,
      unit: r.unit,
      route: r.route,
      days: toDays(r.day),
      doseFormula: (r.doseFormula ?? 'bsa') as ProtocolPhaseDrug['doseFormula'],
      infusionDurationMin: r.infusionDurationMin,
      diluent: r.diluent,
    })),
  }];
}

export function getProtocolPhases(p: ChemoProtocol): ProtocolPhase[] {
  return p.phases?.length ? p.phases : phasesFromLegacy(p);
}

/** First absolute cycle number of each phase. */
export function phaseStartCycles(phases: ProtocolPhase[]): number[] {
  const starts: number[] = [];
  let next = 1;
  for (const ph of phases) { starts.push(next); next += Math.max(0, ph.cycles || 0); }
  return starts;
}

export const totalCycles = (phases: ProtocolPhase[]) =>
  phases.reduce((s, ph) => s + Math.max(0, ph.cycles || 0), 0);

export interface ResolvedDrug {
  lineId: string;
  drug: string;
  dose: number;
  unit: string;
  route: string;
  days: number[];
  doseFormula: ProtocolPhaseDrug['doseFormula'];
  infusionDurationMin?: number;
  diluent?: string;
  maxDose?: number;
  overridden: boolean;
  omitted: boolean;
  note?: string;
}

export function resolveDrugForCycle(line: ProtocolPhaseDrug, phaseCycle: number): ResolvedDrug {
  const r: ResolvedDrug = {
    lineId: line.id, drug: line.drug, dose: line.dose, unit: line.unit, route: line.route,
    days: line.days, doseFormula: line.doseFormula, infusionDurationMin: line.infusionDurationMin,
    diluent: line.diluent, maxDose: line.maxDose, overridden: false, omitted: false,
  };
  // Later overrides win field-by-field
  for (const o of line.overrides ?? []) {
    if (!o.cycles.includes(phaseCycle)) continue;
    r.overridden = true;
    if (o.dose != null) r.dose = o.dose;
    if (o.unit) r.unit = o.unit;
    if (o.days?.length) r.days = o.days;
    if (o.infusionDurationMin != null) r.infusionDurationMin = o.infusionDurationMin;
    if (o.omit != null) r.omitted = o.omit;
    if (o.note) r.note = o.note;
  }
  return r;
}

export interface ResolvedCycle {
  cycle: number; // absolute
  phaseIndex: number;
  phaseCycle: number; // 1-based within the phase
  phase: ProtocolPhase;
  drugs: ResolvedDrug[];
}

export function resolveAllCycles(phases: ProtocolPhase[]): ResolvedCycle[] {
  const out: ResolvedCycle[] = [];
  const starts = phaseStartCycles(phases);
  phases.forEach((phase, phaseIndex) => {
    for (let pc = 1; pc <= (phase.cycles || 0); pc++) {
      out.push({
        cycle: starts[phaseIndex] + pc - 1,
        phaseIndex, phaseCycle: pc, phase,
        drugs: phase.drugs.filter((d) => d.drug).map((d) => resolveDrugForCycle(d, pc)),
      });
    }
  });
  return out;
}

export function resolveCycle(phases: ProtocolPhase[], cycle: number): ResolvedCycle | undefined {
  return resolveAllCycles(phases).find((c) => c.cycle === cycle);
}

// ── Matrix (drug × cycle) ──────────────────────────────────────────────────

export interface MatrixCell {
  phaseIndex: number;
  phaseCycle: number;
  lineId: string;
  resolved: ResolvedDrug;
}

export interface MatrixRow {
  key: string; // normalised drug name
  drug: string;
  cells: (MatrixCell | null)[]; // index = absolute cycle − 1
}

export function buildMatrix(phases: ProtocolPhase[]): { cycles: ResolvedCycle[]; rows: MatrixRow[] } {
  const cycles = resolveAllCycles(phases);
  const rows = new Map<string, MatrixRow>();
  for (const c of cycles) {
    for (const line of c.phase.drugs) {
      if (!line.drug) continue;
      const key = line.drug.trim().toLowerCase();
      if (!rows.has(key)) rows.set(key, { key, drug: line.drug.trim(), cells: cycles.map(() => null) });
      rows.get(key)!.cells[c.cycle - 1] = {
        phaseIndex: c.phaseIndex, phaseCycle: c.phaseCycle, lineId: line.id,
        resolved: resolveDrugForCycle(line, c.phaseCycle),
      };
    }
  }
  return { cycles, rows: [...rows.values()] };
}

// ── Relative schedule (treatment days counted from Day 1 of Cycle 1) ───────

export interface ScheduleDay {
  treatmentDay: number; // 1-based from the start of treatment
  cycle: number;
  cycleDay: number;
  phaseIndex: number;
  phaseName: string;
  drugs: ResolvedDrug[];
}

export function buildRelativeSchedule(phases: ProtocolPhase[]): ScheduleDay[] {
  const days: ScheduleDay[] = [];
  let cycleStart = 1;
  for (const c of resolveAllCycles(phases)) {
    const byDay = new Map<number, ResolvedDrug[]>();
    for (const d of c.drugs) {
      if (d.omitted) continue;
      for (const day of d.days) {
        if (!byDay.has(day)) byDay.set(day, []);
        byDay.get(day)!.push(d);
      }
    }
    for (const day of [...byDay.keys()].sort((a, b) => a - b)) {
      days.push({
        treatmentDay: cycleStart + day - 1, cycle: c.cycle, cycleDay: day,
        phaseIndex: c.phaseIndex, phaseName: c.phase.name, drugs: byDay.get(day)!,
      });
    }
    cycleStart += c.phase.cycleDurationDays || 0;
  }
  return days;
}

export const scheduleLengthDays = (phases: ProtocolPhase[]) =>
  phases.reduce((s, ph) => s + (ph.cycles || 0) * (ph.cycleDurationDays || 0), 0);

// ── Validation ─────────────────────────────────────────────────────────────

export function validatePhases(phases: ProtocolPhase[]): string[] {
  const errors: string[] = [];
  if (!phases.length) errors.push('Add at least one phase.');
  phases.forEach((ph, i) => {
    const label = ph.name || `Phase ${i + 1}`;
    if (!(ph.cycles >= 1)) errors.push(`${label}: cycles must be at least 1.`);
    if (!(ph.cycleDurationDays >= 1)) errors.push(`${label}: cycle length must be at least 1 day.`);
    const drugs = ph.drugs.filter((d) => d.drug);
    if (!drugs.length) errors.push(`${label}: add at least one drug.`);
    for (const d of drugs) {
      if (!(d.dose > 0)) errors.push(`${label} · ${d.drug}: dose must be greater than 0.`);
      if (!d.days.length) errors.push(`${label} · ${d.drug}: choose at least one day.`);
      const lateDay = [...d.days, ...(d.overrides ?? []).flatMap((o) => o.days ?? [])]
        .find((day) => day > ph.cycleDurationDays);
      if (lateDay) errors.push(`${label} · ${d.drug}: day ${lateDay} is beyond the ${ph.cycleDurationDays}-day cycle.`);
      const badCycle = (d.overrides ?? []).flatMap((o) => o.cycles).find((c) => c < 1 || c > ph.cycles);
      if (badCycle) errors.push(`${label} · ${d.drug}: override for cycle ${badCycle} is outside this phase (1–${ph.cycles}).`);
    }
  });
  return errors;
}

/** v2 → legacy flat list (one entry per phase drug line, base dose). */
export function flattenToRegimen(phases: ProtocolPhase[]): RegimenItem[] {
  return phases.flatMap((ph) => ph.drugs.filter((d) => d.drug && d.dose > 0).map((d) => ({
    drug: d.drug, dose: d.dose, unit: d.unit, route: d.route,
    day: d.days.length === 1 ? d.days[0] : d.days,
    doseFormula: d.doseFormula as RegimenItem['doseFormula'], infusionDurationMin: d.infusionDurationMin, diluent: d.diluent,
  })));
}

/** Drops empty drug lines and empty overrides before saving. */
export function cleanPhases(phases: ProtocolPhase[]): ProtocolPhase[] {
  return phases.map((ph) => ({
    ...ph,
    name: ph.name.trim() || 'Phase',
    drugs: ph.drugs.filter((d) => d.drug.trim()).map((d) => ({
      ...d,
      drug: d.drug.trim(),
      days: [...new Set(d.days)].sort((a, b) => a - b),
      doseLevels: d.doseLevels?.filter((l) => l.dose > 0),
      overrides: d.overrides?.filter((o) => o.cycles.length && (o.omit || o.dose != null || o.days?.length || o.infusionDurationMin != null || o.unit || o.note)),
    })),
  }));
}

// ── Override editing (single cycle) ────────────────────────────────────────

/** Replace whatever applies to one phase cycle with a single-cycle override (or clear it). */
export function setCycleOverride(
  line: ProtocolPhaseDrug, phaseCycle: number, patch: Omit<ProtocolDrugOverride, 'cycles'> | null,
): ProtocolPhaseDrug {
  const remaining = (line.overrides ?? [])
    .map((o) => ({ ...o, cycles: o.cycles.filter((c) => c !== phaseCycle) }))
    .filter((o) => o.cycles.length);
  return { ...line, overrides: patch ? [...remaining, { ...patch, cycles: [phaseCycle] }] : remaining };
}

// ── "1-4, 8" ⇄ [1,2,3,4,8] ─────────────────────────────────────────────────

export function parseNumberList(input: string): number[] {
  const out = new Set<number>();
  for (const part of input.split(/[,\s]+/).filter(Boolean)) {
    const m = part.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (m) {
      const [a, b] = [Number(m[1]), Number(m[2])].sort((x, y) => x - y);
      for (let i = a; i <= b && i - a < 400; i++) out.add(i);
    } else if (/^\d+$/.test(part) && Number(part) > 0) {
      out.add(Number(part));
    }
  }
  return [...out].sort((a, b) => a - b);
}

export function formatNumberList(nums: number[]): string {
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(j - i >= 2 ? `${sorted[i]}–${sorted[j]}` : sorted.slice(i, j + 1).join(', '));
    i = j;
  }
  return parts.join(', ');
}

export const formatDays = (days: number[]) => `D${formatNumberList(days).replace(/, /g, ',')}`;
