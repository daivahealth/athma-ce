'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, User, Calendar, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  usePatientTimeline,
  useCreateCustomTimelineEvent,
  useDeleteTimelineEvent,
} from '@/plugins/oncology/hooks/use-oncology';
import { usePatientCancerSummary } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis, CancerTimelineEvent } from '@/plugins/oncology/types';
import { cn } from '@/lib/utils';
import {
  CATEGORY_ORDER,
  getEventCategory,
  getEventCategoryStyle,
  getCategoryStyle,
  type TimelineCategory,
} from '@/plugins/oncology/lib/timeline-category';
import { groupTimelineEvents, type TimelineNode } from '@/plugins/oncology/lib/group-timeline';
import {
  buildJourney,
  daysSinceDiagnosis,
  timelineAnchorId,
} from '@/plugins/oncology/lib/timeline-journey';
import { TimelineJourney } from '@/plugins/oncology/components/TimelineJourney';
import { TimelineEventCard } from '@/plugins/oncology/components/TimelineEventCard';
import { TimelineGroupCard } from '@/plugins/oncology/components/TimelineGroupCard';
import { DateRailSingle, DateRailRange } from '@/plugins/oncology/components/TimelineDateRail';

function getDeepLink(event: CancerTimelineEvent, locale: string): string | null {
  if (!event.source_id) return null;
  const { event_type: t, source_id: sid, patient_id: pid } = event;
  if (t === 'diagnosis') return `/${locale}/oncology/registry/${pid}`;
  if (t === 'staging') return `/${locale}/oncology/staging/${sid}/edit`;
  if (t === 'tumor_board' || t === 'tumor_board_decision')
    return `/${locale}/oncology/tumor-board/${sid}/edit`;
  if (t === 'care_plan_created' || t === 'care_plan_approved')
    return `/${locale}/oncology/care-plans/${sid}/edit`;
  if (t.startsWith('chemo')) return `/${locale}/oncology/orders/${sid}`;
  if (t.startsWith('radiation') || t === 'simulation')
    return `/${locale}/oncology/radiation/${sid}`;
  return null;
}

function severityRingClass(severity: CancerTimelineEvent['severity']): string {
  if (severity === 'milestone')
    return 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background';
  if (severity === 'adverse') return 'ring-2 ring-red-400/60 ring-offset-2 ring-offset-background';
  if (severity === 'warning')
    return 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-background';
  return '';
}

// ── Main page ─────────────────────────────────────────────────────────────────

// Only categories without a structured clinical workflow can be tagged on
// a manual entry - see MANUAL_TIMELINE_CATEGORIES on the backend.
const MANUAL_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'custom', label: 'Note' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'response', label: 'Response Assessment' },
  { value: 'follow_up', label: 'Follow-up' },
];

const MONTH_FMT: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** "3 months", "1 year 2 months", "12 days": a friendly length for the gap since a date. */
function describeSince(days: number) {
  if (days < 45) return `${days} day${days === 1 ? '' : 's'}`;
  const months = Math.round(days / 30.44);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} year${years === 1 ? '' : 's'}${rest ? ` ${rest} month${rest === 1 ? '' : 's'}` : ''}`;
}

function nodeDate(node: TimelineNode) {
  return node.kind === 'group' ? node.endDate : node.event.event_date;
}

function nodeTitle(node: TimelineNode) {
  return node.kind === 'group'
    ? `${node.label}${node.cycleRange ? ` · ${node.cycleRange}` : ''}`
    : node.event.title;
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function CancerTimelinePage() {
  const params = useParams() as { locale: string; patientId: string };
  const router = useRouter();
  const { locale, patientId } = params;

  // Filters: categories are applied here; dates go to the server.
  const [hiddenCategories, setHiddenCategories] = useState<Set<TimelineCategory>>(new Set());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    },
    [],
  );

  // Add event dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDiagnosisId, setNewDiagnosisId] = useState('');
  const [newCategory, setNewCategory] = useState('custom');
  const [newIsMilestone, setNewIsMilestone] = useState(false);

  const { data: summary } = usePatientCancerSummary(patientId);
  const { data: timelineData, isLoading } = usePatientTimeline(patientId, {
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  const createEvent = useCreateCustomTimelineEvent();
  const deleteEvent = useDeleteTimelineEvent(patientId);

  const allEvents: CancerTimelineEvent[] = useMemo(() => timelineData ?? [], [timelineData]);
  const diagnoses = useMemo<CancerDiagnosis[]>(() => summary?.diagnoses ?? [], [summary]);

  const presentCategories = useMemo(() => {
    const set = new Set<TimelineCategory>();
    for (const event of allEvents) set.add(getEventCategory(event));
    return set;
  }, [allEvents]);
  const events = useMemo(
    () => allEvents.filter((e) => !hiddenCategories.has(getEventCategory(e))),
    [allEvents, hiddenCategories],
  );

  const nodes = useMemo(() => groupTimelineEvents(events, 'newest-first'), [events]);
  const journey = useMemo(() => buildJourney(nodes), [nodes]);
  // The feed opens at "Today" and runs newest to oldest. Anything dated today belongs to today;
  // only events on a later day are "coming up", listed compactly in the Today row (soonest first).
  const nowIso = useMemo(() => new Date().toISOString(), []);
  const tomorrowMs = useMemo(() => {
    const d = new Date(nowIso);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  }, [nowIso]);
  const upcoming = useMemo(
    () => nodes.filter((n) => Date.parse(nodeDate(n)) >= tomorrowMs).reverse(),
    [nodes, tomorrowMs],
  );
  const months = useMemo(() => {
    const out: { key: string; label: string; nodes: TimelineNode[] }[] = [];
    for (const node of nodes) {
      if (Date.parse(nodeDate(node)) >= tomorrowMs) continue;
      const key = monthKey(nodeDate(node));
      let bucket = out[out.length - 1];
      if (!bucket || bucket.key !== key) {
        bucket = {
          key,
          label: new Date(nodeDate(node)).toLocaleDateString('en-GB', MONTH_FMT),
          nodes: [],
        };
        out.push(bucket);
      }
      bucket.nodes.push(node);
    }
    return out;
  }, [nodes, tomorrowMs]);

  // Patient display from first diagnosis or summary
  const firstDiag = diagnoses[0];
  const patientName =
    firstDiag?.patient_display_name || firstDiag?.patientDisplay?.displayName || 'Patient';
  const patientMrn = firstDiag?.patient_mrn || firstDiag?.patientDisplay?.mrn;
  const cancerTypes = [...new Set(diagnoses.map((d) => d.cancer_type).filter(Boolean))].join(', ');

  // Journey anchors: first diagnosis, and the most recent event.
  const diagnosisDate = useMemo(() => {
    const dates = [
      ...allEvents.filter((e) => e.event_type === 'diagnosis').map((e) => e.event_date),
      ...diagnoses.map((d) => d.diagnosis_date).filter(Boolean),
    ].sort();
    return dates[0] ?? null;
  }, [allEvents, diagnoses]);
  const today = nowIso;
  const latest = useMemo(
    () =>
      [...allEvents]
        .filter((e) => Date.parse(e.event_date) < tomorrowMs)
        .sort((a, b) => b.event_date.localeCompare(a.event_date))[0] ?? null,
    [allEvents, tomorrowMs],
  );
  const journeyDay = diagnosisDate ? daysSinceDiagnosis(today, diagnosisDate) : null;
  const daysSinceLatest = latest ? daysSinceDiagnosis(today, latest.event_date) : null;
  const initials = patientName
    .split(/\s+/)
    .map((p: string) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const isFiltered = hiddenCategories.size > 0 || !!fromDate || !!toDate;

  const toggleCategory = (category: TimelineCategory) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const scrollToAnchor = (anchorId: string) => {
    document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlighted(anchorId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlighted(null), 1800);
  };

  const handleAddEvent = async () => {
    if (!newTitle.trim() || !newDate) return;
    await createEvent.mutateAsync({
      patientId,
      cancerDiagnosisId: newDiagnosisId || undefined,
      eventDate: newDate,
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory !== 'custom' ? newCategory : undefined,
      severity: newIsMilestone ? 'milestone' : undefined,
    });
    setShowAddDialog(false);
    setNewTitle('');
    setNewDate('');
    setNewDescription('');
    setNewDiagnosisId('');
    setNewCategory('custom');
    setNewIsMilestone(false);
  };

  const renderNode = (node: TimelineNode) => {
    const anchorId = timelineAnchorId(node);
    const isHighlighted = highlighted === anchorId;
    const day = daysSinceDiagnosis(
      node.kind === 'group' ? node.startDate : node.event.event_date,
      diagnosisDate,
    );
    const dayLabel =
      day === null
        ? null
        : node.kind === 'group'
          ? `Day ${day}–${daysSinceDiagnosis(node.endDate, diagnosisDate)}`
          : `Day ${day}`;

    if (node.kind === 'group') {
      const style = getCategoryStyle(node.category);
      return (
        <li key={node.key} id={anchorId} className="flex scroll-mt-24 items-start gap-3">
          <div className="hidden w-20 flex-shrink-0 pt-4 sm:block">
            <DateRailRange startIso={node.startDate} endIso={node.endDate} />
            {dayLabel && (
              <div className="mt-1 text-right text-[10px] font-medium text-primary/80">
                {dayLabel}
              </div>
            )}
          </div>
          <div className="w-6 flex-shrink-0 flex justify-center pt-4">
            <div
              className={cn(
                'relative z-10 h-4 w-4 rounded-full border-2 border-background shadow',
                style.swatch,
              )}
            />
          </div>
          <div
            className={cn(
              'flex-1 min-w-0 rounded-xl transition-shadow duration-500',
              isHighlighted && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
          >
            <p className="mb-1 text-xs text-muted-foreground sm:hidden">
              {formatLongDate(node.startDate)} – {formatLongDate(node.endDate)}
              {dayLabel && <span className="ml-1.5 font-medium text-primary/80">{dayLabel}</span>}
            </p>
            <TimelineGroupCard
              group={node}
              getDeepLink={(event) => getDeepLink(event, locale)}
              onView={(link) => router.push(link)}
              onDelete={(id) => deleteEvent.mutate(id)}
              deletingId={deleteEvent.isPending ? deleteEvent.variables : undefined}
            />
          </div>
        </li>
      );
    }

    const { event } = node;
    const style = getEventCategoryStyle(event);
    const deepLink = getDeepLink(event, locale);
    return (
      <li key={event.id} id={anchorId} className="flex scroll-mt-24 items-start gap-3">
        <div className="hidden w-20 flex-shrink-0 pt-4 sm:block">
          <DateRailSingle iso={event.event_date} />
          {dayLabel && (
            <div className="mt-1 text-right text-[10px] font-medium text-primary/80">
              {dayLabel}
            </div>
          )}
        </div>
        <div className="w-6 flex-shrink-0 flex justify-center pt-4">
          <div
            className={cn(
              'relative z-10 h-3 w-3 rounded-full border-2',
              style.dot,
              severityRingClass(event.severity),
            )}
          />
        </div>
        <div
          className={cn(
            'flex-1 min-w-0 rounded-xl transition-shadow duration-500',
            isHighlighted && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
          )}
        >
          <p className="mb-1 text-xs text-muted-foreground sm:hidden">
            {formatLongDate(event.event_date)}
            {dayLabel && <span className="ml-1.5 font-medium text-primary/80">{dayLabel}</span>}
          </p>
          <TimelineEventCard
            event={event}
            deepLink={deepLink}
            onView={() => deepLink && router.push(deepLink)}
            onDelete={() => deleteEvent.mutate(event.id)}
            isDeleting={deleteEvent.isPending && deleteEvent.variables === event.id}
          />
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Back to the registry entry"
            onClick={() => router.push(`/${locale}/oncology/registry/${patientId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Cancer Timeline</h1>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" />
            Print Summary
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Patient and journey at a glance */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
              {initials || <User className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold leading-tight text-foreground">{patientName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                {patientMrn && (
                  <span className="font-mono text-muted-foreground">{patientMrn}</span>
                )}
                {cancerTypes && (
                  <span className="rounded-md bg-rose-100/70 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                    {cancerTypes}
                  </span>
                )}
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4 md:gap-x-8">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Diagnosed
              </dt>
              <dd className="font-semibold">
                {diagnosisDate ? formatLongDate(diagnosisDate) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Journey</dt>
              <dd className="font-semibold">{journeyDay !== null ? `Day ${journeyDay}` : '—'}</dd>
            </div>
            <div className="col-span-2 min-w-0 sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Latest</dt>
              <dd className="truncate font-semibold" title={latest?.title}>
                {latest ? latest.title : '—'}
                {latest && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    · {formatLongDate(latest.event_date)}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
        {journey && (
          <CardContent className="space-y-3 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">Treatment journey</h2>
              <p className="text-xs text-muted-foreground">
                Select a course or event to jump to it
              </p>
            </div>
            <TimelineJourney layout={journey} onSelect={scrollToAnchor} />
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 print:hidden xl:flex-row xl:items-center xl:justify-between">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Show event categories"
        >
          {CATEGORY_ORDER.filter((c) => presentCategories.has(c)).map((category) => {
            const style = getCategoryStyle(category);
            const shown = !hiddenCategories.has(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={shown}
                onClick={() => toggleCategory(category)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  shown
                    ? 'border-border bg-background text-foreground'
                    : 'border-dashed border-border/70 bg-transparent text-muted-foreground/70',
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    shown ? style.swatch : 'bg-muted-foreground/30',
                  )}
                />
                {style.label}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
          <Label htmlFor="tl-from" className="text-xs text-muted-foreground">
            From
          </Label>
          <Input
            id="tl-from"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-8 w-36 text-xs"
          />
          <Label htmlFor="tl-to" className="text-xs text-muted-foreground">
            To
          </Label>
          <Input
            id="tl-to"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-8 w-36 text-xs"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setHiddenCategories(new Set());
                setFromDate('');
                setToDate('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Timeline feed: newest first */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {isFiltered ? 'No events match the filters' : 'No events yet'}
          </p>
          <p className="text-sm mt-1">
            {isFiltered
              ? 'Show more categories or widen the dates.'
              : 'Events are recorded automatically as clinical data is entered.'}
          </p>
          {!isFiltered && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add a manual note
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Spine through the dot column: (80px date rail + 12px gap, from sm up) + 12px to the dot centre */}
          <div
            className="absolute z-0 left-[12px] sm:left-[104px] top-3 bottom-4 w-px bg-gradient-to-b from-primary/50 via-border to-border/40"
            aria-hidden="true"
          />

          {/* Now */}
          <div className="relative mb-6 flex items-center gap-3">
            <div className="hidden w-20 flex-shrink-0 text-right text-[11px] font-semibold uppercase tracking-wide text-primary sm:block">
              Today
            </div>
            <div className="flex w-6 flex-shrink-0 justify-center">
              <span className="relative z-10 flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="mr-1 font-semibold uppercase tracking-wide text-primary sm:hidden">
                Today
              </span>
              {formatLongDate(today)}
              {daysSinceLatest !== null &&
                latest &&
                (daysSinceLatest === 0
                  ? ' · latest event today'
                  : ` · ${describeSince(daysSinceLatest)} since the latest event`)}
            </p>
          </div>

          {upcoming.length > 0 && (
            <section aria-label="Coming up" className="relative -mt-3 mb-6 flex gap-3">
              <div className="hidden w-20 flex-shrink-0 sm:block" />
              <div className="w-6 flex-shrink-0" />
              <div className="min-w-0 flex-1 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  Coming up
                </p>
                <ul className="space-y-1">
                  {upcoming.map((node) => {
                    const anchorId = timelineAnchorId(node);
                    const category =
                      node.kind === 'group' ? node.category : getEventCategory(node.event);
                    const date = node.kind === 'group' ? node.startDate : node.event.event_date;
                    return (
                      <li
                        key={anchorId}
                        id={anchorId}
                        className={cn(
                          'flex scroll-mt-24 items-center gap-2 rounded-md px-1 text-sm transition-colors',
                          highlighted === anchorId && 'bg-primary/10',
                        )}
                      >
                        <span
                          className={cn(
                            'h-2 w-2 flex-shrink-0 rounded-full',
                            getCategoryStyle(category).swatch,
                          )}
                        />
                        <span className="w-14 flex-shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                          {formatShortDate(date)}
                        </span>
                        <span className="truncate">{nodeTitle(node)}</span>
                        <span className="ml-auto flex-shrink-0 text-xs text-muted-foreground">
                          {getCategoryStyle(category).label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          )}

          <div className="space-y-8">
            {months.map((month) => (
              <section key={month.key} aria-label={month.label}>
                <div className="relative mb-3 flex items-center gap-3">
                  <div className="hidden w-20 flex-shrink-0 sm:block" />
                  <div className="w-6 flex-shrink-0" />
                  <h3 className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                    {month.label}
                    <span className="ml-1.5 font-normal text-muted-foreground">
                      {month.nodes.length} {month.nodes.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </h3>
                </div>
                <ol className="space-y-4">{month.nodes.map(renderNode)}</ol>
              </section>
            ))}
          </div>

          {diagnosisDate && (
            <p className="mt-6 pl-9 text-xs text-muted-foreground sm:pl-[116px]">
              Start of the journey · diagnosed {formatLongDate(diagnosisDate)}
            </p>
          )}
        </div>
      )}

      {/* Add Event Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual Timeline Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUAL_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Laparoscopic resection, Palliative care referral"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Additional clinical notes..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            {diagnoses.length > 0 && (
              <div className="space-y-1.5">
                <Label>
                  Link to Diagnosis{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                <Select
                  value={newDiagnosisId || '__none'}
                  onValueChange={(v) => setNewDiagnosisId(v === '__none' ? '' : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Not linked" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not linked —</SelectItem>
                    {diagnoses.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.cancer_type}
                        {d.primary_site ? ` — ${d.primary_site}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox
                id="milestone"
                checked={newIsMilestone}
                onChange={(e) => setNewIsMilestone(e.target.checked)}
              />
              <Label htmlFor="milestone" className="text-sm font-normal cursor-pointer">
                Mark as major milestone
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEvent}
              disabled={!newTitle.trim() || !newDate || createEvent.isPending}
            >
              {createEvent.isPending ? 'Saving...' : 'Add Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
