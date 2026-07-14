'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { List, Sparkles, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { SectionLabel, FeaturePlaceholder, EmptyState } from './parts';

type ViewMode = 'timeline' | 'encounters';

function fmt(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy');
  } catch {
    return value;
  }
}

function encounterTitle(e: Encounter): string {
  const cls = (e.encounterClass || 'Encounter').replace(/_/g, ' ');
  return cls.charAt(0).toUpperCase() + cls.slice(1);
}

export function CareTimelinePanel({
  encounters,
  isLoading,
  selectedEncounterId,
  onSelectEncounter,
}: {
  encounters: Encounter[];
  isLoading: boolean;
  selectedEncounterId?: string;
  onSelectEncounter: (id: string) => void;
}) {
  const [view, setView] = React.useState<ViewMode>('timeline');

  const ordered = React.useMemo(
    () => [...encounters].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [encounters],
  );

  return (
    <div className="flex h-full flex-col gap-4">
      {/* View toggle */}
      <div className="inline-flex w-fit rounded-lg border border-border/60 bg-muted/40 p-0.5 text-sm">
        <button
          type="button"
          onClick={() => setView('encounters')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors',
            view === 'encounters' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <List className="h-3.5 w-3.5" /> Encounters · {ordered.length}
        </button>
        <button
          type="button"
          onClick={() => setView('timeline')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors',
            view === 'timeline' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Sparkles className="h-3.5 w-3.5" /> Timeline
        </button>
      </div>

      {/* Care narrative — placeholder until the AI narrative endpoint exists */}
      <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <SectionLabel className="text-primary/80">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Care Narrative · AI Summary
            </span>
          </SectionLabel>
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
        <FeaturePlaceholder
          title="AI care narrative not yet available"
          detail="A reverse-chronological synthesis across this patient's documents and encounters will appear here once the Care Context narrative endpoint is live."
          requires="ai-gateway narrative endpoint"
        />
      </div>

      {/* Encounter stream */}
      {isLoading ? (
        <LoadingSpinner size="sm" text="Loading encounters..." />
      ) : ordered.length === 0 ? (
        <EmptyState>No recorded encounters.</EmptyState>
      ) : view === 'timeline' ? (
        <ol className="relative space-y-4 pl-4">
          <span className="absolute left-[5px] top-1 bottom-1 w-px bg-border" aria-hidden />
          {ordered.map((e) => {
            const active = e.id === selectedEncounterId;
            return (
              <li key={e.id} className="relative">
                <span
                  className={cn(
                    'absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full border-2',
                    active ? 'border-primary bg-primary' : 'border-muted-foreground/40 bg-background',
                  )}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => onSelectEncounter(e.id)}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-colors',
                    active ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card/40 hover:bg-accent/40',
                  )}
                >
                  <p className="text-xs text-muted-foreground">{fmt(e.startTime)}</p>
                  <p className="text-sm font-semibold text-foreground">{encounterTitle(e)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{e.encounterNumber}</span>
                    <Badge variant="outline" className="capitalize">{e.status}</Badge>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="space-y-2">
          {ordered.map((e) => {
            const active = e.id === selectedEncounterId;
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => onSelectEncounter(e.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors',
                  active ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card/40 hover:bg-accent/40',
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{encounterTitle(e)}</p>
                  <p className="font-mono text-xs text-muted-foreground">{e.encounterNumber}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">{fmt(e.startTime)}</span>
                  <Badge variant="outline" className="capitalize">{e.status}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
