import type { BadgeTone } from '@/components/ui/tone-badge';
import type { TreatmentItem, WorklistDay } from '@/plugins/oncology/types';

// Day-care board model (pure): which stage of the day each patient is in,
// how long they need a chair, and a chair plan for the day.

export type LaneKey = 'order' | 'approval' | 'pharmacy' | 'ready' | 'infusing' | 'done' | 'held';

export const LANES: { key: LaneKey; title: string; hint: string; tone: BadgeTone }[] = [
  { key: 'order', title: 'To order', hint: 'No chemo order yet', tone: 'sky' },
  { key: 'approval', title: 'Awaiting approval', hint: 'Order signed by prescriber?', tone: 'amber' },
  { key: 'pharmacy', title: 'Pharmacy check', hint: 'Verify and prepare', tone: 'indigo' },
  { key: 'ready', title: 'Ready to give', hint: 'Verified — chair and nurse', tone: 'teal' },
  { key: 'infusing', title: 'Infusing', hint: 'In the chair now', tone: 'violet' },
  { key: 'done', title: 'Done', hint: 'Given today', tone: 'emerald' },
  { key: 'held', title: 'Held', hint: 'Not giving today', tone: 'orange' },
];

export function laneOf(d: WorklistDay): LaneKey {
  if (d.status === 'given' || d.order_status === 'completed') return 'done';
  if (d.status === 'held' || d.order_status === 'held') return 'held';
  if (d.order_status === 'in_progress') return 'infusing';
  if (d.order_status === 'verified') return 'ready';
  if (d.order_status === 'approved') return 'pharmacy';
  if (d.order_status === 'pending' || d.order_status === 'draft') return 'approval';
  return 'order';
}

export type LabGate = 'ok' | 'pending' | 'out_of_range' | 'none';

export function labGateOf(d: WorklistDay): LabGate {
  if (!d.chemo_order_id) return 'none';
  if (!d.labs_reviewed) return 'pending';
  return d.labs_within_range === false ? 'out_of_range' : 'ok';
}

const chemo = (items: TreatmentItem[]) => items.filter((i) => i.kind === 'chemo');

/** Oral-only days are dispensed, not given in a chair. */
export const isOralOnly = (d: WorklistDay) => {
  const c = chemo(d.items);
  return c.length > 0 && c.every((i) => (i.route ?? '').toUpperCase() === 'PO');
};

const hoursOf = (detail?: string) => {
  const m = detail?.match(/×\s*([\d.]+)\s*h/);
  return m ? Number(m[1]) : 0;
};

/** Infusions this long (e.g. 46 h 5-FU, 24 h cytarabine) run on an ambulatory pump, not in the chair. */
export const PUMP_MINUTES = 8 * 60;

const parenteral = (items: TreatmentItem[]) => chemo(items).filter((i) => (i.route ?? '').toUpperCase() !== 'PO');

/** The day sends the patient home (or to the ward) on a continuous-infusion pump. */
export const hasPump = (d: WorklistDay) => parenteral(d.items).some((i) => (i.infusionDurationMin ?? 0) >= PUMP_MINUTES);

/**
 * Chair minutes for a day: infusions run one after another (a pump infusion
 * counts 30 minutes to connect), plus hydration, a 30-minute pre-medication
 * window when there are pre-meds, and 15 minutes to settle and cannulate.
 * Rounded up to 15 minutes; at least 30.
 */
export function chairMinutes(d: WorklistDay): number {
  const infusions = parenteral(d.items)
    .reduce((t, i) => t + ((i.infusionDurationMin ?? 30) >= PUMP_MINUTES ? 30 : (i.infusionDurationMin ?? 30)), 0);
  const hydration = d.items.filter((i) => i.kind === 'hydration').reduce((t, i) => t + hoursOf(i.detail) * 60, 0);
  const premeds = d.items.some((i) => i.kind === 'premed') ? 30 : 0;
  const total = 15 + premeds + infusions + hydration;
  return Math.max(30, Math.ceil(total / 15) * 15);
}

export interface ChairBlock { day: WorklistDay; chair: number; start: number; end: number; lane: LaneKey }

/** Unit opens 08:00; first chairs from 08:30. Minutes from midnight. */
export const UNIT_OPEN = 8 * 60;
export const FIRST_START = 8 * 60 + 30;
export const UNIT_CLOSE = 18 * 60;
const TURNOVER = 15;

/**
 * Chair plan: patients already done or infusing first (they started
 * earliest), then the rest by how far along the sign-off chain they are and
 * longest first; each goes to the chair that frees up first. Long
 * continuous infusions (e.g. 24 h cytarabine) are shown to the unit's close.
 */
export function planChairs(days: WorklistDay[], chairCount: number): ChairBlock[] {
  const order: LaneKey[] = ['done', 'infusing', 'ready', 'pharmacy', 'approval', 'order'];
  const queue = days
    .filter((d) => !isOralOnly(d) && laneOf(d) !== 'held')
    .map((d) => ({ d, lane: laneOf(d), mins: chairMinutes(d) }))
    .sort((a, b) => order.indexOf(a.lane) - order.indexOf(b.lane) || b.mins - a.mins
      || (a.d.patientDisplay?.displayName ?? '').localeCompare(b.d.patientDisplay?.displayName ?? ''));
  const free = Array.from({ length: chairCount }, () => FIRST_START);
  return queue.map(({ d, lane, mins }) => {
    let chair = 0;
    for (let c = 1; c < free.length; c++) if (free[c] < free[chair]) chair = c;
    const start = free[chair];
    const end = Math.min(start + mins, Math.max(UNIT_CLOSE, start + 30));
    free[chair] = end + TURNOVER;
    return { day: d, chair, start, end, lane };
  });
}

/** Enough chairs for the day's chair-minutes at ~85% use, 6 to 30. */
export function suggestChairs(days: WorklistDay[]): number {
  const minutes = days.filter((d) => !isOralOnly(d) && laneOf(d) !== 'held').reduce((t, d) => t + chairMinutes(d) + TURNOVER, 0);
  return Math.max(6, Math.min(30, Math.ceil(minutes / ((UNIT_CLOSE - FIRST_START) * 0.85))));
}

export const clock = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
export const duration = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60} min` : ''}` : `${mins} min`);
