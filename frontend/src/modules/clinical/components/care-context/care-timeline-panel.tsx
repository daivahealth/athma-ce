'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { List, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Encounter } from '@/modules/clinical/types/encounter';
import type { Patient } from '@/modules/clinical/types/patient';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { useClaims } from '@/modules/rcm/hooks/use-claims';
import { usePreAuthRequests } from '@/modules/rcm/hooks/use-preauth';
import { useDenials } from '@/modules/rcm/hooks/use-denials';
import { useInvoices } from '@/modules/rcm/hooks/use-invoices';
import { useCareNarrative } from '@/modules/clinical/hooks/use-care-narrative';
import type { CareNarrativeAvailable, CareNarrativeResult } from '@/modules/clinical/types/care-narrative';
import { SectionLabel, EmptyState, EncounterClassChip } from './parts';

// Type guard: the LLM narrative is present (vs the { available:false } fallback).
function isNarrativeReady(r: CareNarrativeResult | undefined): r is CareNarrativeAvailable {
  return !!r && r.available;
}
import { usePatientTimeline } from '@/plugins/oncology/hooks/use-oncology';
import { buildNarrativePreview } from './narrative-preview';
import { buildAdminSummary, type EncounterRcm } from './encounter-admin-summary';
import { ExternalRecordsPanel } from './ExternalRecordsPanel';
import { CareCancerTimeline } from './care-cancer-timeline';

type ViewMode = 'timeline' | 'encounters' | 'cancer';

// The Cancer Timeline tab surfaces only for oncology patients with a
// substantive recorded journey (more than this many timeline events).
const CANCER_TIMELINE_MIN_EVENTS = 10;

function fmt(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy');
  } catch {
    return value;
  }
}

function encounterTitle(e: Encounter): string {
  const raw = e.encounterType || e.encounterClass || 'Encounter';
  const s = raw.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Context summary for an encounter card — the clinical narrative (notes), falling
// back to the chief complaint so every encounter shows some context (as in the demo).
function encounterSummary(e: Encounter): string {
  return (e.notes ?? '').trim() || (e.chiefComplaint ?? '').trim();
}

export function CareTimelinePanel({
  patient,
  encounters,
  isLoading,
  selectedEncounterId,
  onSelectEncounter,
  staffFilterId,
  onClearStaffFilter,
}: {
  patient: Patient;
  encounters: Encounter[];
  isLoading: boolean;
  selectedEncounterId?: string;
  onSelectEncounter: (id: string) => void;
  /** When set, only encounters for this practitioner are shown (Care Team filter). */
  staffFilterId?: string;
  onClearStaffFilter?: () => void;
}) {
  const [view, setView] = React.useState<ViewMode>('timeline');

  // Cancer Timeline tab — surfaced only for oncology patients with a substantive
  // recorded journey (> CANCER_TIMELINE_MIN_EVENTS cancer-timeline events).
  const { data: cancerTimeline } = usePatientTimeline(patient.id);
  const hasCancerTimeline = (cancerTimeline?.length ?? 0) > CANCER_TIMELINE_MIN_EVENTS;
  React.useEffect(() => {
    if (view === 'cancer' && !hasCancerTimeline) setView('timeline');
  }, [view, hasCancerTimeline]);

  const narrative = React.useMemo(() => buildNarrativePreview(patient, encounters), [patient, encounters]);

  // Live AI narrative from the ai-gateway; specialty is seeded from the local preview's
  // inference so the model tunes emphasis the same way. Falls back to the preview when
  // the endpoint is unavailable (no LLM provider configured) — result.available === false.
  const {
    data: aiNarrative,
    isFetching: aiFetching,
    refetch: refetchNarrative,
  } = useCareNarrative(patient.id, narrative?.specialty);
  // Narrowed to the "available" variant (or null) so the LLM fields are type-safe.
  const aiReady = isNarrativeReady(aiNarrative) ? aiNarrative : null;

  const { data: staff } = useStaffList();
  const staffMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (staff ?? []).forEach((s) =>
      m.set(s.id, s.displayName || `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim()),
    );
    return m;
  }, [staff]);
  const providerName = React.useCallback((id?: string) => (id ? staffMap.get(id) : undefined), [staffMap]);

  const ordered = React.useMemo(
    () => [...encounters].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [encounters],
  );

  // Care Team filter — narrow the encounter list to a single practitioner.
  const displayed = React.useMemo(
    () => (staffFilterId ? ordered.filter((e) => e.primaryStaffId === staffFilterId) : ordered),
    [ordered, staffFilterId],
  );
  const staffFilterName = staffFilterId ? staffMap.get(staffFilterId) : undefined;

  // Revenue-cycle context for the *administrative* summary shown in the Encounters
  // view. Fetched once per patient and grouped by encounter, rather than per row.
  const { data: claimsData } = useClaims({ patientId: patient.id });
  const { data: preauthData } = usePreAuthRequests({ patientId: patient.id });
  const { data: denialsData } = useDenials({ patientId: patient.id });
  const { data: invoicesData } = useInvoices({ patientId: patient.id });

  const rcmByEncounter = React.useMemo(() => {
    const map = new Map<string, EncounterRcm>();
    const bucket = (id?: string | null) => {
      if (!id) return null;
      if (!map.has(id)) map.set(id, { claims: [], preauths: [], denials: [], invoices: [] });
      return map.get(id)!;
    };
    (claimsData?.claims ?? []).forEach((c) => bucket(c.encounterId)?.claims.push(c));
    (preauthData?.requests ?? []).forEach((p) => bucket(p.encounterId)?.preauths.push(p));
    (denialsData?.denials ?? []).forEach((d) => bucket(d.claim?.encounterId)?.denials.push(d));
    (invoicesData ?? []).forEach((i) => bucket(i.encounterId)?.invoices.push(i));
    return map;
  }, [claimsData, preauthData, denialsData, invoicesData]);

  const adminSummaryFor = React.useCallback(
    (id: string) => {
      const rcm = rcmByEncounter.get(id);
      return rcm ? buildAdminSummary(rcm) : buildAdminSummary({ claims: [], preauths: [], denials: [], invoices: [] });
    },
    [rcmByEncounter],
  );

  // Cycle through encounters (wraps around), also driven by the ← / → arrow keys.
  const goPrev = React.useCallback(() => {
    if (displayed.length === 0) return;
    const idx = displayed.findIndex((e) => e.id === selectedEncounterId);
    const next = idx <= 0 ? displayed.length - 1 : idx - 1;
    onSelectEncounter(displayed[next].id);
  }, [displayed, selectedEncounterId, onSelectEncounter]);

  const goNext = React.useCallback(() => {
    if (displayed.length === 0) return;
    const idx = displayed.findIndex((e) => e.id === selectedEncounterId);
    const next = idx === -1 ? 0 : (idx + 1) % displayed.length;
    onSelectEncounter(displayed[next].id);
  }, [displayed, selectedEncounterId, onSelectEncounter]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext]);

  // Keep the currently selected encounter scrolled to the top of the list (just
  // below the fixed top bar) whenever it changes / the view switches.
  const itemRefs = React.useRef<Record<string, HTMLElement | null>>({});
  React.useEffect(() => {
    if (!selectedEncounterId) return;
    itemRefs.current[selectedEncounterId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedEncounterId, view]);

  return (
    <div className="flex flex-col gap-4">
      {/* Fixed top bar: view toggle + encounter cycler (does not scroll) */}
      <div className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-border/60 bg-card/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit flex-wrap items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 text-sm">
            {([
              { key: 'encounters' as const, icon: List, label: `Encounters · ${displayed.length}`, show: true },
              { key: 'timeline' as const, icon: Sparkles, label: 'Timeline', show: true },
              { key: 'cancer' as const, icon: Activity, label: 'Cancer', show: hasCancerTimeline },
            ]).filter((t) => t.show).map((t, i) => (
              <React.Fragment key={t.key}>
                {i > 0 ? <span className="mx-0.5 h-4 w-px bg-border/70" aria-hidden /> : null}
                <button
                  type="button"
                  onClick={() => setView(t.key)}
                  aria-pressed={view === t.key}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors',
                    view === t.key
                      ? 'bg-background font-semibold text-primary shadow-sm ring-1 ring-primary/25'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              </React.Fragment>
            ))}
          </div>
          {view !== 'cancer' ? (
            <div className="inline-flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                aria-label="Previous encounter"
                title="Previous encounter (←)"
                onClick={goPrev}
                disabled={displayed.length < 2}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                aria-label="Next encounter"
                title="Next encounter (→)"
                onClick={goNext}
                disabled={displayed.length < 2}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Care Team filter indicator */}
        {staffFilterId && view !== 'cancer' ? (
          <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs">
            <span className="min-w-0 truncate text-primary">
              Filtered to <span className="font-semibold">{staffFilterName ?? 'practitioner'}</span> · {displayed.length}{' '}
              {displayed.length === 1 ? 'encounter' : 'encounters'}
            </span>
            <button
              type="button"
              onClick={() => onClearStaffFilter?.()}
              className="shrink-0 rounded px-1.5 py-0.5 font-medium text-primary hover:bg-primary/10"
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      {/* Cancer Timeline — reuses the oncology plugin's grouped timeline rendering */}
      {view === 'cancer' ? <CareCancerTimeline patientId={patient.id} /> : null}

      {view !== 'cancer' ? (
        <>
      {/* Care narrative — live AI summary from the ai-gateway, with a client-side
          preview fallback when no LLM provider is configured. */}
      <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between gap-2">
          <SectionLabel className="text-primary/80">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Care Narrative · AI Summary
            </span>
          </SectionLabel>
          <div className="flex items-center gap-2">
            {aiReady ? (
              <Badge variant="secondary" className="text-primary">{aiReady.specialty} review</Badge>
            ) : narrative ? (
              <Badge variant="outline" className="text-muted-foreground">Preview · {narrative.specialty}</Badge>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchNarrative()}
              disabled={aiFetching}
              title="Regenerate the AI care narrative"
            >
              <RefreshCw className={cn('mr-1.5 h-3.5 w-3.5', aiFetching && 'animate-spin')} /> Refresh
            </Button>
          </div>
        </div>

        {aiFetching && !aiNarrative ? (
          <LoadingSpinner size="sm" text="Generating care narrative..." />
        ) : aiReady ? (
          <div className="space-y-2 text-sm">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground">{aiReady.narrative}</div>
            <p className="pt-1 text-xs text-muted-foreground/70">
              AI-generated from {aiReady.sourceCount} clinical record
              {aiReady.sourceCount === 1 ? '' : 's'} · {aiReady.model} ·{' '}
              {fmt(aiReady.generatedAt)}
            </p>
          </div>
        ) : narrative ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-foreground">{narrative.snapshot}</p>
            {narrative.paragraphs.map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">{para}</p>
            ))}
            <p className="pt-1 text-xs text-muted-foreground/70">
              Local preview synthesised from encounter data — the AI narrative endpoint is
              unavailable{aiNarrative && !aiNarrative.available ? ` (${aiNarrative.reason})` : ''}.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No narrative available yet — this patient has no encounters to summarise.
          </p>
        )}
      </div>

      {/* Encounter stream */}
      {isLoading ? (
        <LoadingSpinner size="sm" text="Loading encounters..." />
      ) : displayed.length === 0 ? (
        <EmptyState>No recorded encounters.</EmptyState>
      ) : view === 'timeline' ? (
        <ol className="relative space-y-4 pl-4">
          <span className="absolute left-[5px] top-1 bottom-1 w-px bg-border" aria-hidden />
          {displayed.map((e) => {
            const active = e.id === selectedEncounterId;
            return (
              <li
                key={e.id}
                ref={(el) => {
                  itemRefs.current[e.id] = el;
                }}
                className="relative scroll-mt-16"
              >
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
                  {providerName(e.primaryStaffId) ? (
                    <p className="text-xs text-muted-foreground">{providerName(e.primaryStaffId)}</p>
                  ) : null}
                  {encounterSummary(e) ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{encounterSummary(e)}</p>
                  ) : null}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{e.encounterNumber}</span>
                    <EncounterClassChip value={e.encounterClass} />
                    <Badge variant="outline" className="capitalize">{e.status}</Badge>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="space-y-2">
          {displayed.map((e) => {
            const active = e.id === selectedEncounterId;
            return (
              <button
                key={e.id}
                type="button"
                ref={(el) => {
                  itemRefs.current[e.id] = el;
                }}
                onClick={() => onSelectEncounter(e.id)}
                className={cn(
                  'flex w-full scroll-mt-16 flex-col gap-1 rounded-lg border p-3 text-left transition-colors',
                  active ? 'border-primary/50 bg-primary/5' : 'border-border/60 bg-card/40 hover:bg-accent/40',
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{encounterTitle(e)}</p>
                    <p className="font-mono text-xs text-muted-foreground">{e.encounterNumber}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">{fmt(e.startTime)}</span>
                    <Badge variant="outline" className="capitalize">{e.status}</Badge>
                  </div>
                </div>
                {providerName(e.primaryStaffId) || e.encounterClass ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {providerName(e.primaryStaffId) ? (
                      <span className="text-xs text-muted-foreground">{providerName(e.primaryStaffId)}</span>
                    ) : null}
                    <EncounterClassChip value={e.encounterClass} />
                  </div>
                ) : null}
                {/* Administrative / financial context — the RCM counterpart to the clinical timeline summary */}
                <p className="text-xs leading-relaxed text-muted-foreground">{adminSummaryFor(e.id)}</p>
              </button>
            );
          })}
        </div>
      )}
        </>
      ) : null}

      {/* External / prior records fetched from the HIE (patient-level, consent-driven) */}
      <ExternalRecordsPanel patientId={patient.id} patientReference={patient.mrn} />
    </div>
  );
}
