'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, User, Calendar, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  usePatientTimeline,
  useCreateCustomTimelineEvent,
  useDeleteTimelineEvent,
} from '@/plugins/oncology/hooks/use-oncology';
import { usePatientCancerSummary } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerTimelineEvent } from '@/plugins/oncology/types';
import { cn } from '@/lib/utils';
import {
  getEventCategory, getEventCategoryStyle, getCategoryStyle, type TimelineCategory,
} from '@/plugins/oncology/lib/timeline-category';
import { groupTimelineEvents } from '@/plugins/oncology/lib/group-timeline';
import { TimelineEventCard } from '@/plugins/oncology/components/TimelineEventCard';
import { TimelineGroupCard } from '@/plugins/oncology/components/TimelineGroupCard';
import { TimelineLegend } from '@/plugins/oncology/components/TimelineLegend';
import { DateRailSingle, DateRailRange } from '@/plugins/oncology/components/TimelineDateRail';

function getDeepLink(event: CancerTimelineEvent, locale: string): string | null {
  if (!event.source_id) return null;
  const { event_type: t, source_id: sid, patient_id: pid } = event;
  if (t === 'diagnosis') return `/${locale}/oncology/registry/${pid}`;
  if (t === 'staging') return `/${locale}/oncology/staging/${sid}/edit`;
  if (t === 'tumor_board' || t === 'tumor_board_decision') return `/${locale}/oncology/tumor-board/${sid}/edit`;
  if (t === 'care_plan_created' || t === 'care_plan_approved') return `/${locale}/oncology/care-plans/${sid}/edit`;
  if (t.startsWith('chemo')) return `/${locale}/oncology/orders/${sid}`;
  if (t.startsWith('radiation') || t === 'simulation') return `/${locale}/oncology/radiation/${sid}`;
  return null;
}

function severityRingClass(severity: CancerTimelineEvent['severity']): string {
  if (severity === 'milestone') return 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background';
  if (severity === 'adverse') return 'ring-2 ring-red-400/60 ring-offset-2 ring-offset-background';
  if (severity === 'warning') return 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-background';
  return '';
}

// ── Main page ─────────────────────────────────────────────────────────────────

const EVENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Events' },
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'staging', label: 'Staging' },
  { value: 'tumor_board', label: 'Tumor Board' },
  { value: 'tumor_board_decision', label: 'MDT Decisions' },
  { value: 'care_plan_created', label: 'Care Plans' },
  { value: 'chemo_started', label: 'Chemo (started)' },
  { value: 'chemo_completed', label: 'Chemo (completed)' },
  { value: 'chemo_held', label: 'Chemo (held)' },
  { value: 'radiation_prescribed', label: 'Radiation (prescribed)' },
  { value: 'radiation_started', label: 'Radiation (started)' },
  { value: 'radiation_completed', label: 'Radiation (completed)' },
  { value: 'simulation', label: 'CT Simulation' },
  { value: 'custom', label: 'Manual Notes' },
];

// Only categories without a structured clinical workflow can be tagged on
// a manual entry - see MANUAL_TIMELINE_CATEGORIES on the backend.
const MANUAL_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'custom', label: 'Note' },
  { value: 'surgery', label: 'Surgery' },
  { value: 'response', label: 'Response Assessment' },
  { value: 'follow_up', label: 'Follow-up' },
];

export default function CancerTimelinePage({
  params,
}: {
  params: { locale: string; patientId: string };
}) {
  const router = useRouter();
  const { locale, patientId } = params;

  // Filters
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
    eventType: eventTypeFilter || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  const createEvent = useCreateCustomTimelineEvent();
  const deleteEvent = useDeleteTimelineEvent(patientId);

  const events: CancerTimelineEvent[] = useMemo(() => timelineData ?? [], [timelineData]);
  const diagnoses = summary?.diagnoses ?? [];

  const nodes = useMemo(() => groupTimelineEvents(events), [events]);
  const activeCategories = useMemo(() => {
    const set = new Set<TimelineCategory>();
    for (const event of events) set.add(getEventCategory(event));
    return set;
  }, [events]);

  // Patient display from first diagnosis or summary
  const firstDiag = diagnoses[0] as any;
  const patientName = firstDiag?.patient_display_name || firstDiag?.patientDisplay?.displayName || 'Patient';
  const patientMrn = firstDiag?.patient_mrn || firstDiag?.patientDisplay?.mrn;
  const cancerTypes = [...new Set(diagnoses.map((d: any) => d.cancer_type).filter(Boolean))].join(', ');

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
    setNewTitle(''); setNewDate(''); setNewDescription(''); setNewDiagnosisId('');
    setNewCategory('custom'); setNewIsMilestone(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/oncology/registry/${patientId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Cancer Timeline</h1>
            <p className="text-sm text-muted-foreground">
              {patientName}{patientMrn && ` · MRN: ${patientMrn}`}{cancerTypes && ` · ${cancerTypes}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TimelineLegend activeCategories={activeCategories} />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
              <Printer className="h-4 w-4 mr-1" />Print Summary
            </Button>
            <Button onClick={() => setShowAddDialog(true)} className="print:hidden">
              <Plus className="h-4 w-4 mr-1" />Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Patient banner */}
      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-bold text-foreground">{patientName}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {patientMrn && (
                <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                  {patientMrn}
                </span>
              )}
              {cancerTypes && (
                <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                  {cancerTypes}
                </span>
              )}
              <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                {events.length} events
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="print:hidden">
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Filter Events</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-3">
            <Select value={eventTypeFilter || '__all'} onValueChange={(v) => setEventTypeFilter(v === '__all' ? '' : v)}>
              <SelectTrigger className="w-52 h-8 text-xs">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value || '__all'} value={o.value || '__all'}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">From</Label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 text-xs w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">To</Label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 text-xs w-36" />
            </div>
            {(eventTypeFilter || fromDate || toDate) && (
              <Button variant="ghost" size="sm" className="h-8 text-xs"
                onClick={() => { setEventTypeFilter(''); setFromDate(''); setToDate(''); }}>
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No events yet</p>
          <p className="text-sm mt-1">Events are recorded automatically as clinical data is entered.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />Add a manual note
          </Button>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical connector line - runs through the center of the dot column (64px date rail + 12px gap + 12px to dot center) */}
          <div className="absolute left-[88px] top-4 bottom-4 w-px bg-border" />

          <ol className="space-y-4">
            {nodes.map((node) => {
              if (node.kind === 'group') {
                const style = getCategoryStyle(node.category);
                return (
                  <li key={node.key} className="flex items-start gap-3">
                    <div className="w-16 flex-shrink-0 pt-4">
                      <DateRailRange startIso={node.startDate} endIso={node.endDate} />
                    </div>
                    <div className="w-6 flex-shrink-0 flex justify-center pt-4">
                      <div className={cn('h-4 w-4 rounded-full border-2', style.dot)} />
                    </div>
                    <div className="flex-1 min-w-0">
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
                <li key={event.id} className="flex items-start gap-3">
                  <div className="w-16 flex-shrink-0 pt-4">
                    <DateRailSingle iso={event.event_date} />
                  </div>
                  <div className="w-6 flex-shrink-0 flex justify-center pt-4">
                    <div className={cn('h-3 w-3 rounded-full border-2', style.dot, severityRingClass(event.severity))} />
                  </div>
                  <div className="flex-1 min-w-0">
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
            })}
          </ol>
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MANUAL_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
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
                <Label>Link to Diagnosis <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Select value={newDiagnosisId || '__none'} onValueChange={(v) => setNewDiagnosisId(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Not linked" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Not linked —</SelectItem>
                    {(diagnoses as any[]).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.cancer_type}{d.primary_site ? ` — ${d.primary_site}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Checkbox id="milestone" checked={newIsMilestone} onChange={(e) => setNewIsMilestone(e.target.checked)} />
              <Label htmlFor="milestone" className="text-sm font-normal cursor-pointer">Mark as major milestone</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
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
