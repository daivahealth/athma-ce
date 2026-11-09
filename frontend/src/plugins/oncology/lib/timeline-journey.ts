import type { CancerTimelineEvent } from '../types';
import type { TimelineGroupNode, TimelineNode } from './group-timeline';
import { getEventCategory, type TimelineCategory } from './timeline-category';

/**
 * Swimlane overview of a patient's cancer journey: one lane per kind of care, laid out on a
 * shared time axis from the first event to today. Pure layout data; `TimelineJourney` draws it.
 */

export type JourneyLaneKey =
  'planning' | 'surgery' | 'chemotherapy' | 'radiation' | 'response' | 'notes';

export interface JourneyPoint {
  kind: 'point';
  id: string;
  /** Feed anchor the overview scrolls to. */
  anchorId: string;
  category: TimelineCategory;
  title: string;
  date: string;
  /** 0–100, position on the axis. */
  at: number;
  milestone: boolean;
  warning: boolean;
}

export interface JourneySpan {
  kind: 'span';
  id: string;
  anchorId: string;
  category: 'chemotherapy' | 'radiation';
  title: string;
  startDate: string;
  endDate: string;
  from: number;
  to: number;
  /** Cycle / session ticks inside the bar; `warning` marks held or cancelled sessions. */
  ticks: { at: number; warning: boolean; title: string }[];
}

export interface JourneyLane {
  key: JourneyLaneKey;
  label: string;
  items: (JourneyPoint | JourneySpan)[];
}

export interface JourneyAxisTick {
  label: string;
  at: number;
  /** First tick of a new year, labelled with the year. */
  yearStart: boolean;
}

export interface JourneyLayout {
  start: string;
  end: string;
  todayAt: number;
  lanes: JourneyLane[];
  ticks: JourneyAxisTick[];
}

const LANES: { key: JourneyLaneKey; label: string; categories: TimelineCategory[] }[] = [
  {
    key: 'planning',
    label: 'Diagnosis & planning',
    categories: ['diagnosis', 'staging', 'tumor_board', 'care_plan'],
  },
  { key: 'surgery', label: 'Surgery', categories: ['surgery'] },
  { key: 'chemotherapy', label: 'Chemotherapy', categories: ['chemotherapy'] },
  { key: 'radiation', label: 'Radiotherapy', categories: ['radiation'] },
  { key: 'response', label: 'Response & follow-up', categories: ['response', 'follow_up'] },
  { key: 'notes', label: 'Notes', categories: ['custom'] },
];

const DAY_MS = 86_400_000;

/** Feed element id for an event or course, shared by the overview and the feed. */
export function timelineAnchorId(node: TimelineNode): string {
  return node.kind === 'group'
    ? `tl-${node.key.replace(/[^a-zA-Z0-9-]/g, '-')}`
    : `tl-${node.event.id}`;
}

function laneFor(category: TimelineCategory): JourneyLaneKey {
  return LANES.find((l) => l.categories.includes(category))?.key ?? 'notes';
}

function isWarning(e: CancerTimelineEvent) {
  return (
    e.severity === 'warning' ||
    e.severity === 'adverse' ||
    e.event_type === 'chemo_held' ||
    e.event_type === 'chemo_cancelled'
  );
}

function monthStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Builds the overview from the same nodes the feed renders (so a course is one bar), on an axis
 * from the earliest event to `now` (or the latest event, if later). Returns null without events.
 */
export function buildJourney(nodes: TimelineNode[], now: Date = new Date()): JourneyLayout | null {
  const dates: number[] = [];
  for (const n of nodes) {
    if (n.kind === 'group') dates.push(Date.parse(n.startDate), Date.parse(n.endDate));
    else dates.push(Date.parse(n.event.event_date));
  }
  if (dates.length === 0) return null;

  const startMs = Math.min(...dates);
  const endMs = Math.max(now.getTime(), ...dates);
  // A little air at both ends so dots on the edges are not clipped; at least two weeks wide.
  const span = Math.max(endMs - startMs, 14 * DAY_MS);
  const pad = span * 0.03;
  const axisStart = startMs - pad;
  const axisLen = span + 2 * pad;
  const pos = (ms: number) => Math.min(100, Math.max(0, ((ms - axisStart) / axisLen) * 100));

  const lanes = new Map<JourneyLaneKey, JourneyLane>();
  const lane = (key: JourneyLaneKey) => {
    if (!lanes.has(key))
      lanes.set(key, { key, label: LANES.find((l) => l.key === key)!.label, items: [] });
    return lanes.get(key)!;
  };

  for (const n of nodes) {
    if (n.kind === 'group') {
      lane(n.category).items.push(spanFor(n, pos));
      continue;
    }
    const category = getEventCategory(n.event);
    lane(laneFor(category)).items.push({
      kind: 'point',
      id: n.event.id,
      anchorId: timelineAnchorId(n),
      category,
      title: n.event.title,
      date: n.event.event_date,
      at: pos(Date.parse(n.event.event_date)),
      milestone: n.event.severity === 'milestone',
      warning: isWarning(n.event),
    });
  }

  // Month ticks, thinned to at most ~10 labels.
  const months: Date[] = [];
  for (
    let d = monthStart(new Date(startMs));
    d.getTime() <= endMs;
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  ) {
    if (d.getTime() >= axisStart) months.push(d);
  }
  const step = [1, 2, 3, 6, 12].find((s) => months.length / s <= 10) ?? 12;
  const ticks: JourneyAxisTick[] = [];
  let lastYear: number | null = null;
  months.forEach((d, i) => {
    if (i % step !== 0) return;
    const yearStart = lastYear !== null && d.getFullYear() !== lastYear;
    ticks.push({
      label:
        yearStart || lastYear === null
          ? d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
          : d.toLocaleDateString('en-GB', { month: 'short' }),
      at: pos(d.getTime()),
      yearStart,
    });
    lastYear = d.getFullYear();
  });

  // Under a month there may be no month boundary inside the axis: label the two ends instead.
  if (ticks.length === 0) {
    const fmt = (ms: number) =>
      new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    ticks.push({ label: fmt(startMs), at: pos(startMs), yearStart: false });
    if (endMs - startMs >= 3 * DAY_MS)
      ticks.push({ label: fmt(endMs), at: pos(endMs), yearStart: false });
  }

  return {
    start: new Date(startMs).toISOString(),
    end: new Date(endMs).toISOString(),
    todayAt: pos(now.getTime()),
    lanes: LANES.map((l) => lanes.get(l.key)).filter((l): l is JourneyLane => !!l),
    ticks,
  };
}

function spanFor(group: TimelineGroupNode, pos: (ms: number) => number): JourneySpan {
  return {
    kind: 'span',
    id: group.key,
    anchorId: timelineAnchorId(group),
    category: group.category,
    title: `${group.label}${group.cycleRange ? ` · ${group.cycleRange}` : ''}`,
    startDate: group.startDate,
    endDate: group.endDate,
    from: pos(Date.parse(group.startDate)),
    to: pos(Date.parse(group.endDate)),
    ticks: group.events.map((e) => {
      const cycle = e.metadata?.cycleNumber;
      const deferred = typeof cycle === 'number' && group.heldCycles.includes(cycle);
      return {
        at: pos(Date.parse(e.event_date)),
        warning: isWarning(e) || deferred,
        title: deferred && !isWarning(e) ? `${e.title} (deferred first)` : e.title,
      };
    }),
  };
}

/** Whole days from the first diagnosis to `iso` ("Day 0" is the diagnosis day); null before or without one. */
export function daysSinceDiagnosis(
  iso: string,
  diagnosisIso: string | null | undefined,
): number | null {
  if (!diagnosisIso) return null;
  const a = new Date(diagnosisIso);
  const b = new Date(iso);
  const days = Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      DAY_MS,
  );
  return days >= 0 ? days : null;
}
