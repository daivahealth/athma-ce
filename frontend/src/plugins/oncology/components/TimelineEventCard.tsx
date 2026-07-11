'use client';

import { ExternalLink, Trash2, AlertTriangle, Calendar, UserRound, CheckCircle2, XCircle, PauseCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CancerTimelineEvent } from '../types';
import { getEventCategoryStyle, getEventLabel } from '../lib/timeline-category';

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function SessionStatusIcon({ event }: { event: CancerTimelineEvent }) {
  if (event.event_type === 'chemo_completed' || event.event_type === 'radiation_completed') {
    return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }
  if (event.event_type === 'chemo_cancelled') {
    return <XCircle className="h-4 w-4 text-red-500" />;
  }
  if (event.event_type === 'chemo_held') {
    return <PauseCircle className="h-4 w-4 text-amber-500" />;
  }
  return <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />;
}

export interface TimelineEventCardProps {
  event: CancerTimelineEvent;
  deepLink: string | null;
  onView: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  /** Compact row rendering for events nested inside a course group ("Session N"). */
  compact?: boolean;
}

export function TimelineEventCard({
  event, deepLink, onView, onDelete, isDeleting, compact = false,
}: TimelineEventCardProps) {
  const style = getEventCategoryStyle(event);
  const Icon = style.icon;
  const isManual = event.source_entity === 'manual';

  if (compact) {
    return (
      <div className="group/row flex items-center justify-between gap-3 rounded-lg bg-background/60 border border-border/40 px-3 py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <SessionStatusIcon event={event} />
          <span className="text-xs font-semibold text-foreground whitespace-nowrap">
            {event.metadata?.dayNumber ? `Day ${event.metadata.dayNumber}` : getEventLabel(event.event_type)}
          </span>
          <span className="text-xs text-muted-foreground truncate">{formatDate(event.event_date)}</span>
        </div>
        {isManual && (
          <Button
            variant="ghost" size="sm"
            className="h-6 px-1.5 text-xs text-destructive hover:text-destructive opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  const provider = typeof event.metadata?.provider === 'string' ? event.metadata.provider : undefined;

  return (
    <div className={cn(
      'group/card rounded-xl border border-l-4 p-4 transition-shadow hover:shadow-sm',
      style.border, style.bg,
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn(
            'flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-background border-2 mt-0.5',
            style.ring,
          )}>
            <Icon className={cn('h-4 w-4', style.iconColor)} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground leading-tight">{event.title}</p>
              {event.severity === 'milestone' && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide">
                  Major Milestone
                </Badge>
              )}
              {event.severity === 'warning' && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide">
                  <AlertTriangle className="h-3 w-3 mr-1" />Warning
                </Badge>
              )}
              {event.severity === 'adverse' && (
                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wide">
                  <AlertTriangle className="h-3 w-3 mr-1" />Adverse Event
                </Badge>
              )}
              {event.severity === 'info' && (
                <Badge variant="secondary" className={cn('text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wide', style.badge)}>
                  {getEventLabel(event.event_type)}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />{formatDate(event.event_date)}
              </span>
              {provider && (
                <span className="inline-flex items-center gap-1">
                  <UserRound className="h-3 w-3" />{provider}
                </span>
              )}
            </div>

            {event.description && (
              <>
                <div className="border-t border-border/50 my-2" />
                <p className="text-xs text-muted-foreground">{event.description}</p>
              </>
            )}

            <MetadataChips event={event} />
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {deepLink && (
            <Button
              variant="ghost" size="sm"
              className="h-7 px-2 text-xs opacity-0 group-hover/card:opacity-100 transition-opacity"
              onClick={onView}
            >
              <ExternalLink className="h-3 w-3 mr-1" />View
            </Button>
          )}
          {isManual && (
            <Button
              variant="ghost" size="sm"
              className="h-7 px-2 text-xs text-destructive hover:text-destructive opacity-0 group-hover/card:opacity-100 transition-opacity"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
