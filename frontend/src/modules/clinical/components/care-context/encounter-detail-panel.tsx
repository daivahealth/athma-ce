'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Zap, FileText, Shield, FlaskConical } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { useClaims } from '@/modules/rcm/hooks/use-claims';
import { usePreAuthRequests } from '@/modules/rcm/hooks/use-preauth';
import { useEncounterCoverages } from '@/modules/rcm/hooks/use-encounter-coverages';
import { useEncounterObservations } from '@/modules/clinical/hooks/use-observations';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { Field, SectionLabel, FeaturePlaceholder, EmptyState } from './parts';

function fmtDateTime(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy · HH:mm');
  } catch {
    return value;
  }
}

function money(amount?: number | null, currency?: string | null): string {
  if (amount == null) return '—';
  const n = Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency ? `${currency} ${n}` : n;
}

function titleCase(value?: string | null): string {
  if (!value) return 'Encounter';
  const s = value.replace(/_/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type SectionKey = 'encounter' | 'results' | 'documents' | 'claims' | 'preauth' | 'denials' | 'policy';

export function EncounterDetailPanel({ encounter }: { encounter?: Encounter }) {
  const encounterId = encounter?.id;

  const { data: claimsData, isLoading: claimsLoading } = useClaims(encounterId ? { encounterId } : undefined);
  const { data: preauthData, isLoading: preauthLoading } = usePreAuthRequests(encounterId ? { encounterId } : undefined);
  const { data: coverages, isLoading: coveragesLoading } = useEncounterCoverages(encounterId);
  const { data: results, isLoading: resultsLoading } = useEncounterObservations(encounterId);
  const { data: staff } = useStaffList();

  const providerName = React.useMemo(() => {
    if (!encounter?.primaryStaffId) return undefined;
    const s = (staff ?? []).find((m) => m.id === encounter.primaryStaffId);
    return s ? s.displayName || `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() : undefined;
  }, [staff, encounter?.primaryStaffId]);

  const claims = encounterId ? claimsData?.claims ?? [] : [];
  const preauths = encounterId ? preauthData?.requests ?? [] : [];
  const encounterCoverages = coverages ?? [];
  const encounterResults = results ?? [];

  const refs = React.useRef<Record<SectionKey, HTMLDivElement | null>>({
    encounter: null,
    results: null,
    documents: null,
    claims: null,
    preauth: null,
    denials: null,
    policy: null,
  });
  const scrollTo = (key: SectionKey) =>
    refs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!encounter) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
        <EmptyState>Select an encounter to view its details and claim pipeline.</EmptyState>
      </div>
    );
  }

  const nav: { key: SectionKey; label: string }[] = [
    { key: 'encounter', label: 'Encounter' },
    { key: 'results', label: `Results · ${encounterResults.length}` },
    { key: 'documents', label: 'Documents' },
    { key: 'claims', label: `Claims · ${claims.length}` },
    { key: 'preauth', label: `Pre-Auth · ${preauths.length}` },
    { key: 'denials', label: 'Denials' },
    { key: 'policy', label: `Policy · ${encounterCoverages.length}` },
  ];

  const setRef = (key: SectionKey) => (el: HTMLDivElement | null) => {
    refs.current[key] = el;
  };

  return (
    <div className="space-y-4">
      {/* Header — context-setting only; full facts live on the selected timeline card */}
      <div ref={setRef('encounter')} className="scroll-mt-20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{encounter.encounterNumber}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">
                {encounter.encounterType || titleCase(encounter.encounterClass)}
              </h3>
              <Badge variant="outline" className="capitalize">{encounter.status}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {[
                fmtDateTime(encounter.startTime),
                providerName ? `Dr ${providerName}` : null,
                encounter.facilityName,
                encounter.departmentName,
                encounter.priority ? titleCase(encounter.priority) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => scrollTo('results')}>
              <FlaskConical className="mr-1.5 h-3.5 w-3.5" /> Results
            </Button>
            <Button variant="default" size="sm" disabled title="Requires claim-pipeline orchestration (follow-up)">
              <Zap className="mr-1.5 h-3.5 w-3.5" /> Run claim pipeline
            </Button>
          </div>
        </div>
        {encounter.chiefComplaint ? (
          <p className="mt-2 text-sm text-foreground">
            <span className="text-muted-foreground">Chief complaint — </span>
            {encounter.chiefComplaint}
          </p>
        ) : null}
      </div>

      {/* Financials — no single aggregate endpoint yet */}
      <div className="grid grid-cols-3 gap-2">
        {['Total Billed', 'Total Paid', 'Patient Owes'].map((label) => (
          <div key={label} className="rounded-lg border border-border/60 bg-card/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">{label}</p>
            <p className="mt-0.5 text-base font-semibold text-muted-foreground">—</p>
          </div>
        ))}
      </div>

      {/* Sticky section nav — clicking scrolls to the section */}
      <div className="sticky top-0 z-10 -mx-4 flex gap-1 overflow-x-auto border-b border-border/60 bg-card/95 px-4 py-2 backdrop-blur">
        {nav.map((n) => (
          <button
            key={n.key}
            type="button"
            onClick={() => scrollTo(n.key)}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Stacked sections (infinite scroll) */}
      <div className="space-y-6">
        {/* Results (encounter-linked observations) */}
        <section ref={setRef('results')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Results</SectionLabel>
          {resultsLoading ? (
            <LoadingSpinner size="sm" text="Loading results..." />
          ) : encounterResults.length === 0 ? (
            <EmptyState>No results linked to this encounter.</EmptyState>
          ) : (
            <div className="space-y-2">
              {encounterResults.map((o) => {
                const value = o.valueNumeric != null ? String(o.valueNumeric) : o.valueString ?? '—';
                return (
                  <div key={o.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.displayName}</p>
                      <p className="text-xs text-muted-foreground">{fmtDateTime(o.observedAt)}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {value}
                      {o.unit ? <span className="ml-1 text-xs font-normal text-muted-foreground">{o.unit}</span> : null}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Documents — received/uploaded for this encounter */}
        <section ref={setRef('documents')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Documents</SectionLabel>
          <FeaturePlaceholder
            title="Encounter documents not yet wired"
            detail="Documents received and uploaded for this encounter (reports, DICOM, referrals) will be listed here once the encounter-document endpoint is connected."
            requires="clinical encounter-documents endpoint"
          />
        </section>

        {/* Claims */}
        <section ref={setRef('claims')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Claims</SectionLabel>
          {claimsLoading ? (
            <LoadingSpinner size="sm" text="Loading claims..." />
          ) : claims.length === 0 ? (
            <EmptyState>No claims for this encounter.</EmptyState>
          ) : (
            claims.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">{c.claimNumber}</p>
                    <p className="text-xs text-muted-foreground">{money(c.totalAmount, c.currency)}</p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{String(c.status).toLowerCase()}</Badge>
              </div>
            ))
          )}
        </section>

        {/* Pre-Auth */}
        <section ref={setRef('preauth')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Pre-Authorization</SectionLabel>
          {preauthLoading ? (
            <LoadingSpinner size="sm" text="Loading pre-authorizations..." />
          ) : preauths.length === 0 ? (
            <EmptyState>No pre-authorizations for this encounter.</EmptyState>
          ) : (
            preauths.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">{p.internalRef}</p>
                    {p.authorizationNumber ? (
                      <p className="text-xs text-muted-foreground">Auth {p.authorizationNumber}</p>
                    ) : null}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{String(p.status).toLowerCase()}</Badge>
              </div>
            ))
          )}
        </section>

        {/* Denials — greenfield */}
        <section ref={setRef('denials')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Denials & Appeals</SectionLabel>
          <FeaturePlaceholder
            title="Denials & appeals not yet available"
            detail="Denial codes (e.g. CO-197), appeal drafting, and appeal deadlines require a dedicated RCM denials module. Denied claims currently surface only as a claim status."
            requires="rcm denials + appeals module"
          />
        </section>

        {/* Encounter-level Policy */}
        <section ref={setRef('policy')} className="scroll-mt-20 space-y-2">
          <SectionLabel>Policy (this encounter)</SectionLabel>
          {coveragesLoading ? (
            <LoadingSpinner size="sm" text="Loading coverage..." />
          ) : encounterCoverages.length === 0 ? (
            <EmptyState>No policy selected for this encounter.</EmptyState>
          ) : (
            encounterCoverages.map((cov) => (
              <div key={cov.id} className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-card/40 p-4">
                <Field label="Plan" value={cov.planName || '—'} />
                <Field label="Financial class" value={<span className="capitalize">{String(cov.financialClass).toLowerCase()}</span>} />
                <Field label="Member" value={cov.memberName || '—'} />
                <Field label="Member ID" value={<span className="font-mono">{cov.memberId || '—'}</span>} />
                <Field label="Network" value={cov.networkName || '—'} />
                <Field label="Coverage level" value={<span className="capitalize">{String(cov.coverageLevel).toLowerCase()}</span>} />
                {cov.copayAmount != null ? <Field label="Copay" value={money(cov.copayAmount)} /> : null}
                {cov.coinsurancePct != null ? <Field label="Coinsurance" value={`${cov.coinsurancePct}%`} /> : null}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
