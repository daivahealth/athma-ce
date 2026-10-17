import type { ProtocolPhase, ProtocolPhaseDrug } from './protocol-phases';

// Patient treatment schedule generation (pure functions — no DB access).
// A treatment plan snapshots the protocol; every treatment day carries the
// items to prepare and give that day, with doses calculated for the patient.

export interface ProtocolSnapshot {
  id: string;
  code: string;
  name: string;
  phases: ProtocolPhase[];
  premedications: string[];
  supportiveCare: string[];
  hydration: { fluid: string; ratePerHour: number; durationHours: number; timing: 'pre' | 'concurrent' | 'post' }[];
  labPrerequisites: { test: string; parameter: string; minValue?: number | null; unit: string; timing: string }[];
  emetogenicRisk?: string | null;
}

export interface PatientMeasures {
  heightCm?: number | null;
  weightKg?: number | null;
  bsa?: number | null;
  creatinineClearance?: number | null;
}

export type TreatmentItemKind = 'lab' | 'premed' | 'hydration' | 'chemo' | 'supportive';

export interface TreatmentItem {
  kind: TreatmentItemKind;
  sequence: number;
  label: string;
  detail?: string;
  timing?: 'before' | 'pre' | 'concurrent' | 'post';
  // chemo only
  drug?: string;
  protocolDose?: number;
  protocolUnit?: string;
  doseFormula?: string;
  doseLevel?: number;
  levelDose?: number; // dose after dose level, in protocol units
  calculatedDose?: number | null; // patient dose
  calculatedUnit?: string;
  route?: string;
  infusionDurationMin?: number;
  diluent?: string;
  capped?: boolean;
  note?: string;
  warning?: string;
}

export interface PlannedCycle {
  cycleNumber: number;
  phaseIndex: number;
  phaseName: string;
  phaseCycle: number;
  plannedStartDate: string; // YYYY-MM-DD
  cycleDurationDays: number;
}

export interface PlannedDay {
  cycleNumber: number;
  cycleDay: number;
  scheduledDate: string; // YYYY-MM-DD
  items: TreatmentItem[];
}

// ── Dates (UTC, date-only) ─────────────────────────────────────────────────

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// ── Dosing ─────────────────────────────────────────────────────────────────

/** Mosteller BSA (m²). */
export function mostellerBsa(heightCm: number, weightKg: number): number {
  return Math.round(Math.sqrt((heightCm * weightKg) / 3600) * 100) / 100;
}

export function resolveBsa(m: PatientMeasures): number | null {
  if (m.bsa && m.bsa > 0) return Number(m.bsa);
  if (m.heightCm && m.weightKg) return mostellerBsa(Number(m.heightCm), Number(m.weightKg));
  return null;
}

/**
 * Dose for a dose level: the drug's predefined level dose. A drug with no dose
 * levels at all is not dose-reduced (e.g. trastuzumab); one that defines other
 * levels but not this one keeps the full dose with a warning.
 */
export function doseForLevel(line: Pick<ProtocolPhaseDrug, 'doseLevels'>, baseDose: number, level: number) {
  if (!level || !line.doseLevels?.length) return { dose: baseDose };
  const defined = line.doseLevels?.find((l) => l.level === level);
  if (defined) return { dose: defined.dose };
  return { dose: baseDose, warning: `No dose level ${level} defined — full dose used` };
}

const round = (n: number) => (n >= 100 ? Math.round(n) : Math.round(n * 10) / 10);

/**
 * Patient dose from a protocol dose. AUC uses Calvert (AUC × (CrCl + 25)),
 * with CrCl capped at 125 mL/min.
 */
export function calculateDose(
  dose: number, unit: string, formula: string, m: PatientMeasures, maxDose?: number,
): { dose: number | null; unit: string; capped?: boolean; warning?: string } {
  const outUnit = unit.startsWith('units') ? 'units' : 'mg';
  let value: number | null = null;
  let warning: string | undefined;
  if (formula === 'bsa') {
    const bsa = resolveBsa(m);
    if (bsa) value = dose * bsa; else warning = 'BSA unavailable';
  } else if (formula === 'weight') {
    if (m.weightKg) value = dose * Number(m.weightKg); else warning = 'Weight unavailable';
  } else if (formula === 'auc') {
    if (m.creatinineClearance) value = dose * (Math.min(Number(m.creatinineClearance), 125) + 25);
    else warning = 'CrCl needed for Calvert (AUC) dosing';
  } else {
    value = dose;
    return { dose: round(value), unit };
  }
  if (value == null) return { dose: null, unit: outUnit, warning };
  if (maxDose && outUnit === 'mg' && value > maxDose) return { dose: maxDose, unit: outUnit, capped: true };
  return { dose: round(value), unit: outUnit };
}

// ── Schedule ───────────────────────────────────────────────────────────────

export function planCycles(phases: ProtocolPhase[], startDate: string): PlannedCycle[] {
  const cycles: PlannedCycle[] = [];
  let n = 1;
  let start = startDate;
  phases.forEach((ph, phaseIndex) => {
    for (let pc = 1; pc <= ph.cycles; pc++) {
      cycles.push({
        cycleNumber: n++, phaseIndex, phaseName: ph.name, phaseCycle: pc,
        plannedStartDate: start, cycleDurationDays: ph.cycleDurationDays,
      });
      start = addDays(start, ph.cycleDurationDays);
    }
  });
  return cycles;
}

/** Resolved drug lines (overrides applied, omitted removed) given on a cycle day. */
function drugsOnDay(phase: ProtocolPhase, phaseCycle: number, cycleDay: number) {
  return phase.drugs.flatMap((line) => {
    let dose = line.dose; let unit = line.unit; let days = line.days; let omit = false; let note: string | undefined;
    let infusionDurationMin = line.infusionDurationMin;
    for (const o of line.overrides ?? []) {
      if (!o.cycles.includes(phaseCycle)) continue;
      if (o.dose != null) dose = o.dose;
      if (o.unit) unit = o.unit;
      if (o.days?.length) days = o.days;
      if (o.infusionDurationMin != null) infusionDurationMin = o.infusionDurationMin;
      if (o.omit != null) omit = o.omit;
      if (o.note) note = o.note;
    }
    if (omit || !days.includes(cycleDay)) return [];
    return [{ line, dose, unit, note, infusionDurationMin }];
  });
}

/** Cycle days that have at least one drug. */
export function treatmentDaysOfCycle(phase: ProtocolPhase, phaseCycle: number): number[] {
  const set = new Set<number>();
  for (let d = 1; d <= phase.cycleDurationDays; d++) {
    if (drugsOnDay(phase, phaseCycle, d).length) set.add(d);
  }
  return [...set].sort((a, b) => a - b);
}

export function buildDayItems(
  snapshot: ProtocolSnapshot, cycle: Pick<PlannedCycle, 'phaseIndex' | 'phaseCycle'>, cycleDay: number,
  measures: PatientMeasures, doseLevel = 0,
): TreatmentItem[] {
  const phase = snapshot.phases[cycle.phaseIndex];
  const items: TreatmentItem[] = [];
  let seq = 1;
  const firstDayOfCycle = treatmentDaysOfCycle(phase, cycle.phaseCycle)[0] === cycleDay;

  if (firstDayOfCycle) {
    for (const lab of snapshot.labPrerequisites ?? []) {
      items.push({
        kind: 'lab', sequence: seq++, timing: 'before',
        label: `${lab.test}${lab.parameter ? ` — ${lab.parameter}` : ''}`,
        detail: [lab.minValue != null ? `≥ ${lab.minValue} ${lab.unit}`.trim() : null, lab.timing].filter(Boolean).join(' · '),
      });
    }
  }
  for (const pm of snapshot.premedications ?? []) {
    items.push({ kind: 'premed', sequence: seq++, timing: 'pre', label: pm });
  }
  for (const h of (snapshot.hydration ?? []).filter((x) => x.timing === 'pre')) {
    items.push({ kind: 'hydration', sequence: seq++, timing: 'pre', label: h.fluid, detail: `${h.ratePerHour} mL/h × ${h.durationHours} h` });
  }
  for (const { line, dose, unit, note, infusionDurationMin } of drugsOnDay(phase, cycle.phaseCycle, cycleDay)) {
    const lvl = doseForLevel(line, dose, doseLevel);
    const calc = calculateDose(lvl.dose, unit, line.doseFormula, measures, line.maxDose);
    items.push({
      kind: 'chemo', sequence: seq++, label: line.drug,
      drug: line.drug, protocolDose: dose, protocolUnit: unit, doseFormula: line.doseFormula,
      doseLevel, levelDose: lvl.dose, calculatedDose: calc.dose, calculatedUnit: calc.unit,
      route: line.route, infusionDurationMin, diluent: line.diluent,
      capped: calc.capped, note, warning: [lvl.warning, calc.warning].filter(Boolean).join('; ') || undefined,
    });
  }
  for (const h of (snapshot.hydration ?? []).filter((x) => x.timing !== 'pre')) {
    items.push({ kind: 'hydration', sequence: seq++, timing: h.timing, label: h.fluid, detail: `${h.ratePerHour} mL/h × ${h.durationHours} h` });
  }
  if (firstDayOfCycle) {
    for (const sc of snapshot.supportiveCare ?? []) {
      items.push({ kind: 'supportive', sequence: seq++, timing: 'post', label: sc });
    }
  }
  return items;
}

export function generateSchedule(snapshot: ProtocolSnapshot, startDate: string, measures: PatientMeasures) {
  const cycles = planCycles(snapshot.phases, startDate);
  const days: PlannedDay[] = cycles.flatMap((c) =>
    treatmentDaysOfCycle(snapshot.phases[c.phaseIndex], c.phaseCycle).map((cycleDay) => ({
      cycleNumber: c.cycleNumber,
      cycleDay,
      scheduledDate: addDays(c.plannedStartDate, cycleDay - 1),
      items: buildDayItems(snapshot, c, cycleDay, measures),
    })),
  );
  return { cycles, days };
}

/** Order dose adjustments (percent of protocol dose) for chemo items below full dose. */
export function doseAdjustmentsFor(items: TreatmentItem[]) {
  return items
    .filter((i) => i.kind === 'chemo' && i.doseLevel && i.protocolDose && i.levelDose !== i.protocolDose)
    .map((i) => ({
      drug: i.drug!,
      adjustmentPercent: Math.round(((i.levelDose ?? 0) / (i.protocolDose ?? 1)) * 100),
      reason: `Dose level ${i.doseLevel}`,
    }));
}
