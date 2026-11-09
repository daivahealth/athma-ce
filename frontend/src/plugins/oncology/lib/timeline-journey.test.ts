import type { CancerTimelineEvent } from '../types';
import { groupTimelineEvents } from './group-timeline';
import { buildJourney, daysSinceDiagnosis, timelineAnchorId } from './timeline-journey';
import { CATEGORY_ORDER, getCategoryStyle } from './timeline-category';

let seq = 0;
function ev(
  event_type: string,
  event_date: string,
  extra: Partial<CancerTimelineEvent> = {},
): CancerTimelineEvent {
  seq += 1;
  return {
    id: `e${seq}`,
    tenant_id: 't',
    patient_id: 'p',
    cancer_diagnosis_id: 'd1',
    event_type: event_type as CancerTimelineEvent['event_type'],
    event_date,
    title: `${event_type} ${event_date}`,
    metadata: {},
    severity: 'info',
    created_by: 'u',
    created_at: event_date,
    ...extra,
  };
}

const journey = [
  ev('diagnosis', '2025-11-05T10:00:00.000Z', { severity: 'milestone' }),
  ev('staging', '2025-11-09T10:00:00.000Z'),
  ev('chemo_completed', '2025-11-19T10:00:00.000Z', {
    metadata: { protocol: 'AC-T', cycleNumber: 1 },
  }),
  ev('chemo_held', '2025-12-03T10:00:00.000Z', {
    severity: 'warning',
    metadata: { protocol: 'AC-T', cycleNumber: 2 },
  }),
  ev('chemo_completed', '2025-12-10T10:00:00.000Z', {
    metadata: { protocol: 'AC-T', cycleNumber: 2 },
  }),
  ev('chemo_completed', '2025-12-24T10:00:00.000Z', {
    metadata: { protocol: 'AC-T', cycleNumber: 3 },
  }),
  ev('custom', '2026-02-10T10:00:00.000Z', {
    severity: 'milestone',
    metadata: { category: 'surgery' },
  }),
  ev('response_assessment', '2026-04-01T10:00:00.000Z', { severity: 'milestone' }),
];

describe('groupTimelineEvents newest-first', () => {
  it('puts the latest event first and places a course at its latest session', () => {
    const nodes = groupTimelineEvents(journey, 'newest-first');
    const order = nodes.map((n) => (n.kind === 'group' ? `course:${n.label}` : n.event.event_type));
    expect(order).toEqual(['response_assessment', 'custom', 'course:AC-T', 'staging', 'diagnosis']);
  });

  it('keeps a course’s sessions oldest first and its dates intact', () => {
    const group = groupTimelineEvents(journey, 'newest-first').find((n) => n.kind === 'group');
    expect(group?.kind).toBe('group');
    if (group?.kind !== 'group') return;
    expect(group.startDate).toBe('2025-11-19T10:00:00.000Z');
    expect(group.endDate).toBe('2025-12-24T10:00:00.000Z');
    expect(group.events.map((e) => e.metadata.cycleNumber)).toEqual([1, 2, 3]);
  });

  it('still defaults to oldest first', () => {
    const nodes = groupTimelineEvents(journey);
    expect(nodes[0].kind === 'single' && nodes[0].event.event_type).toBe('diagnosis');
  });
});

describe('buildJourney', () => {
  const now = new Date('2026-05-01T00:00:00.000Z');
  const layout = buildJourney(groupTimelineEvents(journey, 'newest-first'), now)!;

  it('lays out lanes in clinical order, only for kinds of care present', () => {
    expect(layout.lanes.map((l) => l.key)).toEqual([
      'planning',
      'surgery',
      'chemotherapy',
      'response',
    ]);
  });

  it('draws a course as one span with a tick per session, marking held cycles', () => {
    const chemo = layout.lanes.find((l) => l.key === 'chemotherapy')!;
    expect(chemo.items).toHaveLength(1);
    const span = chemo.items[0];
    expect(span.kind).toBe('span');
    if (span.kind !== 'span') return;
    expect(span.from).toBeLessThan(span.to);
    expect(span.ticks).toHaveLength(3);
    // Cycle 2 was deferred before it was given: its tick stays amber.
    expect(span.ticks.map((t) => t.warning)).toEqual([false, true, false]);
  });

  it('honours a manual event’s category tag and milestone severity', () => {
    const surgery = layout.lanes.find((l) => l.key === 'surgery')!.items[0];
    expect(surgery.kind === 'point' && surgery.milestone).toBe(true);
  });

  it('positions everything on 0–100 with today at the right end when it is the latest point', () => {
    const all = layout.lanes.flatMap((l) =>
      l.items.map((i) => (i.kind === 'span' ? i.from : i.at)),
    );
    expect(Math.min(...all)).toBeGreaterThanOrEqual(0);
    expect(layout.todayAt).toBeGreaterThan(Math.max(...all));
    expect(layout.todayAt).toBeLessThanOrEqual(100);
  });

  it('labels months on the axis, with the year on the first label and on a new year', () => {
    expect(layout.ticks.length).toBeGreaterThan(2);
    expect(layout.ticks.length).toBeLessThanOrEqual(11);
    expect(layout.ticks[0].label).toMatch(/2025/);
    expect(layout.ticks.some((t) => t.yearStart && /2026/.test(t.label))).toBe(true);
  });

  it('labels the two ends of a journey shorter than a month', () => {
    const short = buildJourney(
      groupTimelineEvents([
        ev('diagnosis', '2026-11-09T10:00:00.000Z'),
        ev('tumor_board', '2026-11-18T10:00:00.000Z'),
      ]),
      new Date('2026-11-09T12:00:00.000Z'),
    )!;
    expect(short.ticks.map((t) => t.label)).toEqual(['9 Nov', '18 Nov']);
  });

  it('returns null without events', () => {
    expect(buildJourney([], now)).toBeNull();
  });

  it('uses the same anchor ids as the feed', () => {
    const nodes = groupTimelineEvents(journey, 'newest-first');
    const anchors = new Set(nodes.map(timelineAnchorId));
    for (const lane of layout.lanes)
      for (const item of lane.items) expect(anchors.has(item.anchorId)).toBe(true);
  });
});

describe('daysSinceDiagnosis', () => {
  it('counts calendar days from the diagnosis day', () => {
    expect(daysSinceDiagnosis('2025-11-05T18:00:00.000Z', '2025-11-05T06:00:00.000Z')).toBe(0);
    expect(daysSinceDiagnosis('2026-11-09T10:00:00.000Z', '2025-11-05T10:00:00.000Z')).toBe(369);
  });

  it('is null before the diagnosis or without one', () => {
    expect(daysSinceDiagnosis('2025-11-01T10:00:00.000Z', '2025-11-05T10:00:00.000Z')).toBeNull();
    expect(daysSinceDiagnosis('2025-11-01T10:00:00.000Z', null)).toBeNull();
  });
});

describe('category styles for bare category names', () => {
  it('maps every category name to its own style (not "Note")', () => {
    for (const c of CATEGORY_ORDER) expect(getCategoryStyle(c).category).toBe(c);
  });
});
