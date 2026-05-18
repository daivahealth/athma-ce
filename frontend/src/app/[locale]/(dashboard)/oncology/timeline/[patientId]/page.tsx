'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Trash2, ExternalLink, User,
  Activity, FlaskConical, Zap, Stethoscope,
  ClipboardList, CheckCircle2, AlertTriangle, Info,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { CancerTimelineEvent, TimelineEventType } from '@/plugins/oncology/types';
import { cn } from '@/lib/utils';

// ── Colour config by event type group ────────────────────────────────────────

function getEventStyle(type: TimelineEventType) {
  if (type === 'diagnosis') return { border: 'border-l-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300', icon: Stethoscope, iconColor: 'text-rose-500' };
  if (type === 'staging') return { border: 'border-l-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', icon: Activity, iconColor: 'text-purple-500' };
  if (type === 'tumor_board' || type === 'tumor_board_decision') return { border: 'border-l-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', icon: ClipboardList, iconColor: 'text-indigo-500' };
  if (type.startsWith('care_plan')) return { border: 'border-l-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: CheckCircle2, iconColor: 'text-blue-500' };
  if (type.startsWith('chemo')) return { border: 'border-l-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/20', badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', icon: FlaskConical, iconColor: 'text-teal-500' };
  if (type.startsWith('radiation') || type === 'simulation') return { border: 'border-l-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', icon: Zap, iconColor: 'text-orange-500' };
  // custom / fallback
  return { border: 'border-l-gray-300', bg: 'bg-gray-50 dark:bg-gray-900/20', badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: Info, iconColor: 'text-gray-400' };
}

function getSeverityDot(severity: string) {
  if (severity === 'milestone') return 'h-4 w-4 bg-primary border-2 border-primary';
  if (severity === 'warning') return 'h-3 w-3 bg-amber-400 border-2 border-amber-400';
  if (severity === 'adverse') return 'h-3 w-3 bg-red-500 border-2 border-red-500';
  return 'h-3 w-3 bg-background border-2 border-primary';
}

function getEventLabel(type: TimelineEventType): string {
  const labels: Record<TimelineEventType, string> = {
    diagnosis: 'Diagnosis',
    staging: 'Staging',
    tumor_board: 'Tumor Board',
    tumor_board_decision: 'MDT Decision',
    care_plan_created: 'Care Plan',
    care_plan_approved: 'Care Plan',
    chemo_ordered: 'Chemo',
    chemo_approved: 'Chemo',
    chemo_started: 'Chemo',
    chemo_completed: 'Chemo',
    chemo_held: 'Chemo',
    chemo_cancelled: 'Chemo',
    radiation_prescribed: 'Radiation',
    radiation_started: 'Radiation',
    radiation_completed: 'Radiation',
    simulation: 'Simulation',
    response_assessment: 'Response',
    follow_up: 'Follow-up',
    custom: 'Note',
  };
  return labels[type] ?? type;
}

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

// ── Metadata chips ────────────────────────────────────────────────────────────

function MetadataChips({ event }: { event: CancerTimelineEvent }) {
  const m = event.metadata ?? {};
  const chips: { label: string; value: string; color?: string }[] = [];

  if (event.event_type === 'diagnosis') {
    if (m.primarySite) chips.push({ label: 'Site', value: String(m.primarySite) });
    if (m.clinicalStatus) chips.push({ label: 'Status', value: String(m.clinicalStatus) });
    if (m.metastaticStatus && m.metastaticStatus !== 'unknown') chips.push({ label: 'Spread', value: String(m.metastaticStatus), color: 'amber' });
    if (m.grade) chips.push({ label: 'Grade', value: String(m.grade), color: 'purple' });
  }
  if (event.event_type === 'staging') {
    const tnm = [m.tCategory && `T${m.tCategory}`, m.nCategory && `N${m.nCategory}`, m.mCategory && `M${m.mCategory}`].filter(Boolean).join(' ');
    if (m.stagingSystem) chips.push({ label: 'System', value: String(m.stagingSystem) });
    if (m.stagingType) chips.push({ label: 'Type', value: String(m.stagingType) });
    if (tnm) chips.push({ label: 'TNM', value: tnm, color: 'purple' });
    if (m.stageGroup) chips.push({ label: 'Stage', value: String(m.stageGroup), color: 'purple' });
  }
  if (event.event_type.startsWith('chemo')) {
    if (m.protocol) chips.push({ label: 'Protocol', value: String(m.protocol) });
    if (m.cycleNumber) chips.push({ label: 'Cycle', value: String(m.cycleNumber) });
    if (m.dayNumber) chips.push({ label: 'Day', value: String(m.dayNumber) });
    if (m.bsa) chips.push({ label: 'BSA', value: `${m.bsa} m²` });
    if (m.reason) chips.push({ label: 'Reason', value: String(m.reason), color: 'amber' });
  }
  if (event.event_type.startsWith('radiation') || event.event_type === 'simulation') {
    if (m.modality) chips.push({ label: 'Modality', value: String(m.modality) });
    if (m.technique) chips.push({ label: 'Technique', value: String(m.technique) });
    if (m.totalDoseGy) chips.push({ label: 'Dose', value: `${m.totalDoseGy} Gy` });
    if (m.plannedFractions) chips.push({ label: 'Fractions', value: String(m.plannedFractions) });
    if (m.deliveredTotalDoseGy) chips.push({ label: 'Delivered', value: `${m.deliveredTotalDoseGy} Gy` });
    if (m.deliveredFractions) chips.push({ label: 'Fx delivered', value: String(m.deliveredFractions) });
    if (m.interruptions) chips.push({ label: 'Interruptions', value: 'Yes', color: 'amber' });
    if (m.patientPosition) chips.push({ label: 'Position', value: String(m.patientPosition) });
    if (m.scanRegion) chips.push({ label: 'Region', value: String(m.scanRegion) });
  }
  if (event.event_type.startsWith('care_plan')) {
    if (m.treatmentIntent) chips.push({ label: 'Intent', value: String(m.treatmentIntent) });
    if (m.subspecialty) chips.push({ label: 'Subspecialty', value: String(m.subspecialty) });
    if (m.planNumber) chips.push({ label: 'Plan#', value: String(m.planNumber) });
  }

  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {chips.map((c, i) => (
        <span key={i} className={cn(
          'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px]',
          c.color === 'amber' ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          c.color === 'purple' ? 'bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
          'bg-muted text-muted-foreground',
        )}>
          <span className="opacity-60">{c.label}</span>
          <span className="font-medium capitalize">{c.value}</span>
        </span>
      ))}
    </div>
  );
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

  const { data: summary } = usePatientCancerSummary(patientId);
  const { data: timelineData, isLoading } = usePatientTimeline(patientId, {
    eventType: eventTypeFilter || undefined,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  });
  const createEvent = useCreateCustomTimelineEvent();
  const deleteEvent = useDeleteTimelineEvent(patientId);

  const events: CancerTimelineEvent[] = timelineData ?? [];
  const diagnoses = summary?.diagnoses ?? [];

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
    });
    setShowAddDialog(false);
    setNewTitle(''); setNewDate(''); setNewDescription(''); setNewDiagnosisId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />Add Event
        </Button>
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
      <Card>
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
          {/* Vertical connector line */}
          <div className="absolute left-[18px] top-4 bottom-4 w-px bg-border" />

          <ol className="space-y-4 pl-10">
            {events.map((event) => {
              const style = getEventStyle(event.event_type);
              const dotCls = getSeverityDot(event.severity);
              const deepLink = getDeepLink(event, locale);
              const Icon = style.icon;
              const isManual = event.source_entity === 'manual';

              return (
                <li key={event.id} className="relative group">
                  {/* Severity dot on the timeline */}
                  <div className={cn(
                    'absolute -left-[28px] top-4 rounded-full',
                    dotCls,
                  )} />

                  {/* Event card */}
                  <div className={cn(
                    'rounded-xl border border-l-4 p-4 transition-shadow hover:shadow-sm',
                    style.border,
                    style.bg,
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Event type icon */}
                        <div className={cn(
                          'flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-md bg-background/80 border border-border/50 mt-0.5',
                        )}>
                          <Icon className={cn('h-3.5 w-3.5', style.iconColor)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Header row: type badge + date + severity indicator */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wide', style.badge)}>
                              {getEventLabel(event.event_type)}
                            </Badge>
                            {event.severity === 'milestone' && (
                              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">● Milestone</span>
                            )}
                            {event.severity === 'warning' && (
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                                <AlertTriangle className="h-3 w-3" />Warning
                              </span>
                            )}
                            <time className="text-xs text-muted-foreground ml-auto">
                              {new Date(event.event_date).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric',
                              })}
                            </time>
                          </div>

                          {/* Title */}
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {event.title}
                          </p>

                          {/* Description */}
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
                          )}

                          {/* Metadata chips */}
                          <MetadataChips event={event} />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {deepLink && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => router.push(deepLink)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />View
                          </Button>
                        )}
                        {isManual && (
                          <Button
                            variant="ghost" size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => deleteEvent.mutate(event.id)}
                            disabled={deleteEvent.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
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
            <div className="space-y-1.5">
              <Label>Date *</Label>
              <Input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. Imaging ordered, Palliative care referral"
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
