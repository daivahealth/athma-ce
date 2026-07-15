'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading';
import { usePatientTimeline, useDeleteTimelineEvent } from '@/plugins/oncology/hooks/use-oncology';
import type { CancerTimelineEvent } from '@/plugins/oncology/types';
import {
  getEventCategory,
  getEventCategoryStyle,
  getCategoryStyle,
  type TimelineCategory,
} from '@/plugins/oncology/lib/timeline-category';
import { groupTimelineEvents } from '@/plugins/oncology/lib/group-timeline';
import { TimelineEventCard } from '@/plugins/oncology/components/TimelineEventCard';
import { TimelineGroupCard } from '@/plugins/oncology/components/TimelineGroupCard';
import { TimelineLegend } from '@/plugins/oncology/components/TimelineLegend';
import { DateRailSingle, DateRailRange } from '@/plugins/oncology/components/TimelineDateRail';
import { EmptyState } from './parts';

// Deep-links from a timeline event to the corresponding oncology workspace page
// (mirrors the standalone Cancer Timeline page).
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

/**
 * The oncology Cancer Timeline, rendered inside the Care Context middle panel.
 * Reuses the exact grouping + card components from the oncology plugin so the
 * visualisation is identical to the standalone /oncology/timeline page.
 */
export function CareCancerTimeline({ patientId }: { patientId: string }) {
  const router = useRouter();
  const locale = (useParams().locale as string) ?? 'en';

  const { data, isLoading } = usePatientTimeline(patientId);
  const deleteEvent = useDeleteTimelineEvent(patientId);

  const events: CancerTimelineEvent[] = React.useMemo(() => data ?? [], [data]);
  const nodes = React.useMemo(() => groupTimelineEvents(events), [events]);
  const activeCategories = React.useMemo(() => {
    const set = new Set<TimelineCategory>();
    for (const event of events) set.add(getEventCategory(event));
    return set;
  }, [events]);

  if (isLoading) return <LoadingSpinner size="sm" text="Loading cancer timeline..." />;
  if (events.length === 0) return <EmptyState>No cancer timeline events recorded.</EmptyState>;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <TimelineLegend activeCategories={activeCategories} />
      </div>

      <div className="relative">
        {/* Vertical connector through the dot column (64px rail + gaps). */}
        <div className="absolute z-0 left-[88px] top-4 bottom-4 w-px bg-border" />

        <ol className="space-y-4">
          {nodes.map((node) => {
            if (node.kind === 'group') {
              const style = getCategoryStyle(node.category);
              return (
                <li key={node.key} className="flex items-start gap-3">
                  <div className="w-16 flex-shrink-0 pt-4">
                    <DateRailRange startIso={node.startDate} endIso={node.endDate} />
                  </div>
                  <div className="flex w-6 flex-shrink-0 justify-center pt-4">
                    <div className={cn('relative z-10 h-4 w-4 rounded-full border-2', style.dot)} />
                  </div>
                  <div className="min-w-0 flex-1">
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
                <div className="flex w-6 flex-shrink-0 justify-center pt-4">
                  <div className={cn('relative z-10 h-3 w-3 rounded-full border-2', style.dot, severityRingClass(event.severity))} />
                </div>
                <div className="min-w-0 flex-1">
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
    </div>
  );
}
