import type { CancerTimelineEvent } from '../types';
import { getCategory } from './timeline-category';

export interface TimelineSingleNode {
  kind: 'single';
  sortDate: string;
  event: CancerTimelineEvent;
}

export interface TimelineGroupNode {
  kind: 'group';
  sortDate: string;
  key: string;
  category: 'chemotherapy' | 'radiation';
  /** Protocol / modality name shown in the group header. */
  label: string;
  /** One row per rendered session - for chemo, de-duplicated to one (most-advanced) event per cycle. */
  events: CancerTimelineEvent[];
  startDate: string;
  endDate: string;
  /** e.g. "Cycles 1-4" for chemo, derived from metadata.cycleNumber. */
  cycleRange?: string;
  completedCount: number;
  heldOrCancelledCount: number;
  /** Distinct cycles/sessions actually recorded. */
  sessionCount: number;
  /** Planned total from the protocol, when known (chemo only). */
  totalPlanned?: number;
  /** Best-known values merged across every event in the group (later events win ties). */
  bsa?: number;
  modality?: string;
  technique?: string;
  target?: string;
  totalDoseGy?: number;
  deliveredTotalDoseGy?: number;
  plannedFractions?: number;
  deliveredFractions?: number;
}

export type TimelineNode = TimelineSingleNode | TimelineGroupNode;

const GROUPABLE_CATEGORIES = new Set(['chemotherapy', 'radiation']);

// Later stage wins when de-duplicating same-cycle chemo events down to one row.
const CHEMO_STAGE_RANK: Record<string, number> = {
  chemo_ordered: 0,
  chemo_approved: 1,
  chemo_started: 2,
  chemo_held: 3,
  chemo_cancelled: 3,
  chemo_completed: 4,
};

function groupKeyFor(event: CancerTimelineEvent, category: string): string {
  return category === 'chemotherapy'
    ? `chemo::${event.cancer_diagnosis_id ?? 'x'}::${event.metadata?.protocol ?? 'unknown'}`
    : `radiation::${event.cancer_diagnosis_id ?? 'x'}::${event.metadata?.modality ?? event.metadata?.technique ?? 'unknown'}`;
}

function groupLabel(category: string, events: CancerTimelineEvent[]): string {
  const m = events[events.length - 1]?.metadata ?? {};
  if (category === 'chemotherapy') {
    return (m.protocol as string) || 'Chemotherapy course';
  }
  const modality = (m.modality as string) || (m.technique as string);
  return modality ? `Radiation - ${modality}` : 'Radiation course';
}

function cycleRangeFor(events: CancerTimelineEvent[]): string | undefined {
  const cycles = events
    .map((e) => e.metadata?.cycleNumber)
    .filter((c): c is number => typeof c === 'number');
  if (cycles.length === 0) return undefined;
  const min = Math.min(...cycles);
  const max = Math.max(...cycles);
  return min === max ? `Cycle ${min}` : `Cycles ${min}-${max}`;
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

/**
 * Collapses same-cycle chemo lifecycle events (ordered -> approved ->
 * started -> completed/held/cancelled, each logged as its own timeline
 * event) down to one row per cycle, keeping the most advanced status.
 * Radiation events aren't collapsed - prescribed/started/completed are
 * distinct milestones for one course, not repeats of the same session.
 */
function dedupeByCycle(events: CancerTimelineEvent[]): CancerTimelineEvent[] {
  const byCycle = new Map<number | string, CancerTimelineEvent>();
  const order: (number | string)[] = [];
  for (const event of events) {
    const cycle = event.metadata?.cycleNumber as number | undefined ?? event.id;
    const existing = byCycle.get(cycle);
    if (!existing) {
      byCycle.set(cycle, event);
      order.push(cycle);
      continue;
    }
    const existingRank = CHEMO_STAGE_RANK[existing.event_type] ?? -1;
    const newRank = CHEMO_STAGE_RANK[event.event_type] ?? -1;
    if (newRank >= existingRank) byCycle.set(cycle, event);
  }
  return order.map((c) => byCycle.get(c)!);
}

/**
 * Groups chemo and radiation events that belong to the same treatment
 * course (same protocol/modality within the same diagnosis) so a full
 * course renders as one collapsible entry instead of flooding the timeline
 * with one row per lifecycle transition. Every other event type
 * (diagnosis, staging, tumor board, care plan, response, follow-up,
 * custom) stays as its own standalone node. A group with only one
 * resulting session is emitted as a single node instead - grouping only
 * pays off once there's actually something to collapse.
 */
export function groupTimelineEvents(events: CancerTimelineEvent[]): TimelineNode[] {
  const buckets = new Map<string, CancerTimelineEvent[]>();
  const order: string[] = [];

  for (const event of events) {
    const category = getCategory(event.event_type);
    if (!GROUPABLE_CATEGORIES.has(category)) continue;

    const groupKey = groupKeyFor(event, category);
    if (!buckets.has(groupKey)) {
      buckets.set(groupKey, []);
      order.push(groupKey);
    }
    buckets.get(groupKey)!.push(event);
  }

  const groupedEventIds = new Set<string>();
  const groupNodeByKey = new Map<string, TimelineGroupNode>();

  for (const key of order) {
    const rawEvents = buckets.get(key)!;
    const category = getCategory(rawEvents[0].event_type) as 'chemotherapy' | 'radiation';
    const sessions = category === 'chemotherapy'
      ? dedupeByCycle([...rawEvents].sort((a, b) => a.event_date.localeCompare(b.event_date)))
      : [...rawEvents].sort((a, b) => a.event_date.localeCompare(b.event_date));

    for (const e of rawEvents) groupedEventIds.add(e.id);
    if (sessions.length < 2) continue; // nothing to collapse

    const completedCount = sessions.filter((e) =>
      e.event_type === 'chemo_completed' || e.event_type === 'radiation_completed').length;
    const heldOrCancelledCount = sessions.filter((e) =>
      e.event_type === 'chemo_held' || e.event_type === 'chemo_cancelled').length;

    // Merge metadata across all raw events chronologically - later events
    // (e.g. chemo_completed, radiation_completed) carry the most complete
    // picture (delivered dose/fractions), so they win ties.
    const merged: Record<string, unknown> = {};
    for (const e of [...rawEvents].sort((a, b) => a.event_date.localeCompare(b.event_date))) {
      for (const [k, v] of Object.entries(e.metadata ?? {})) {
        if (v !== undefined && v !== null) merged[k] = v;
      }
    }

    groupNodeByKey.set(key, {
      kind: 'group',
      key,
      category,
      label: groupLabel(category, sessions),
      events: sessions,
      startDate: sessions[0].event_date,
      endDate: sessions[sessions.length - 1].event_date,
      cycleRange: category === 'chemotherapy' ? cycleRangeFor(sessions) : undefined,
      completedCount,
      heldOrCancelledCount,
      sessionCount: sessions.length,
      totalPlanned: num(merged.protocolTotalCycles),
      bsa: num(merged.bsa),
      modality: str(merged.modality),
      technique: str(merged.technique),
      target: str(merged.scanRegion),
      totalDoseGy: num(merged.totalDoseGy),
      deliveredTotalDoseGy: num(merged.deliveredTotalDoseGy),
      plannedFractions: num(merged.plannedFractions),
      deliveredFractions: num(merged.deliveredFractions),
      // Position the group where its first event falls, so it reads
      // chronologically alongside ungrouped entries.
      sortDate: sessions[0].event_date,
    });
  }

  const nodes: TimelineNode[] = [];
  const emittedGroupKeys = new Set<string>();

  for (const event of events) {
    if (groupedEventIds.has(event.id)) {
      const category = getCategory(event.event_type);
      const groupKey = groupKeyFor(event, category);
      const group = groupNodeByKey.get(groupKey);
      if (!group) {
        // The bucket had <2 sessions after dedup - fall through as a single node.
        nodes.push({ kind: 'single', event, sortDate: event.event_date });
        continue;
      }
      if (!emittedGroupKeys.has(groupKey)) {
        emittedGroupKeys.add(groupKey);
        nodes.push(group);
      }
      continue;
    }
    nodes.push({ kind: 'single', event, sortDate: event.event_date });
  }

  nodes.sort((a, b) => a.sortDate.localeCompare(b.sortDate));
  return nodes;
}
