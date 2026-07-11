'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, PauseCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CancerTimelineEvent } from '../types';
import { getCategoryStyle } from '../lib/timeline-category';
import type { TimelineGroupNode } from '../lib/group-timeline';
import { TimelineEventCard } from './TimelineEventCard';
import { StatBox, ProgressBar } from './TimelineParts';

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatDurationRange(startIso: string, endIso: string): string {
  const startYear = new Date(startIso).getFullYear();
  const endYear = new Date(endIso).getFullYear();
  const start = formatDateShort(startIso);
  const end = formatDateShort(endIso);
  return startYear === endYear
    ? `${start} - ${end} ${endYear}`
    : `${start} ${startYear} - ${end} ${endYear}`;
}

interface ProgressInfo {
  label: string;
  fraction: string;
  percent: number;
}

function getProgress(group: TimelineGroupNode): ProgressInfo | undefined {
  if (group.category === 'chemotherapy') {
    if (!group.totalPlanned) return undefined;
    const done = group.completedCount;
    return { label: 'Progress', fraction: `${done}/${group.totalPlanned}`, percent: (done / group.totalPlanned) * 100 };
  }
  if (group.plannedFractions) {
    const delivered = group.deliveredFractions ?? 0;
    return {
      label: 'Fractions',
      fraction: `${delivered}/${group.plannedFractions}`,
      percent: (delivered / group.plannedFractions) * 100,
    };
  }
  return undefined;
}

function statBoxesFor(group: TimelineGroupNode): { label: string; value: string }[] {
  if (group.category === 'chemotherapy') {
    return [
      { label: 'Duration', value: formatDurationRange(group.startDate, group.endDate) },
      { label: 'Total Dosage', value: group.bsa ? `BSA ${group.bsa} m²` : '—' },
      {
        label: 'Status',
        value: group.heldOrCancelledCount > 0
          ? `${group.heldOrCancelledCount} held/cancelled`
          : group.totalPlanned && group.completedCount >= group.totalPlanned
            ? 'Completed cycle'
            : 'In progress',
      },
    ];
  }
  return [
    { label: 'Target', value: group.target ?? '—' },
    {
      label: 'Fraction Count',
      value: group.plannedFractions
        ? `${group.deliveredFractions ?? 0} / ${group.plannedFractions} fractions`
        : '—',
    },
    { label: 'Total Dose', value: group.totalDoseGy ? `${group.totalDoseGy} Gy` : '—' },
  ];
}

export interface TimelineGroupCardProps {
  group: TimelineGroupNode;
  getDeepLink: (event: CancerTimelineEvent) => string | null;
  onView: (deepLink: string) => void;
  onDelete: (id: string) => void;
  deletingId?: string;
}

export function TimelineGroupCard({ group, getDeepLink, onView, onDelete, deletingId }: TimelineGroupCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = getCategoryStyle(group.category);
  const Icon = style.icon;
  const progress = getProgress(group);
  const isActive = group.completedCount < (group.totalPlanned ?? group.sessionCount)
    && group.heldOrCancelledCount === 0;

  return (
    <div className={cn('rounded-xl border border-l-4 overflow-hidden', style.border, style.bg)}>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-background/40 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-md bg-background/80 border border-border/50">
            <Icon className={cn('h-4 w-4', style.iconColor)} />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">
                  {group.label}{group.cycleRange && <span className="font-normal text-muted-foreground"> · {group.cycleRange}</span>}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary" className={cn('text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wide', style.badge)}>
                    {isActive ? 'Active Course' : `${group.label} Course`}
                  </Badge>
                  {group.heldOrCancelledCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      <PauseCircle className="h-3 w-3" />{group.heldOrCancelledCount} held/cancelled
                    </span>
                  )}
                </div>
              </div>
              {progress && (
                <div className="w-32 flex-shrink-0 text-right">
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    {progress.label}: <span className="text-foreground">{progress.fraction}</span>
                  </p>
                  <div className="mt-1">
                    <ProgressBar percent={progress.percent} colorClass={style.swatch} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {statBoxesFor(group).map((box) => (
                <StatBox key={box.label} label={box.label} value={box.value} />
              ))}
            </div>

            {group.category === 'radiation' && (
              <p className="text-[11px] text-muted-foreground">
                Start: {formatDateShort(group.startDate)} &nbsp;·&nbsp; {isActive ? 'Latest' : 'End'}: {formatDateShort(group.endDate)} {new Date(group.endDate).getFullYear()}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1 text-muted-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="relative pl-6 space-y-2">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border/70" />
            {[...group.events].reverse().map((event) => {
              const deepLink = getDeepLink(event);
              return (
                <div key={event.id} className="relative">
                  <div className={cn('absolute -left-[19px] top-3 h-2 w-2 rounded-full border-2', style.dot)} />
                  <TimelineEventCard
                    event={event}
                    deepLink={deepLink}
                    onView={() => deepLink && onView(deepLink)}
                    onDelete={() => onDelete(event.id)}
                    isDeleting={deletingId === event.id}
                    compact
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
