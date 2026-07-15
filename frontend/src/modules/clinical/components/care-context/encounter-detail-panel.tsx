'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Zap, FileText, Shield, FlaskConical, Receipt, AlertOctagon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { useClaims } from '@/modules/rcm/hooks/use-claims';
import { usePreAuthRequests } from '@/modules/rcm/hooks/use-preauth';
import { useEncounterCoverages } from '@/modules/rcm/hooks/use-encounter-coverages';
import { useInvoices } from '@/modules/rcm/hooks/use-invoices';
import { useDenials, useDraftAppeal, useFileAppeal } from '@/modules/rcm/hooks/use-denials';
import { useEncounterObservations } from '@/modules/clinical/hooks/use-observations';
import { useEncounterResults } from '@/modules/clinical/hooks/use-reporting';
import type { PatientResult } from '@/modules/clinical/types/reporting';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { Field, SectionLabel, EmptyState, Chip, EncounterClassChip } from './parts';

function fmtDateTime(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy · HH:mm');
  } catch {
    return value;
  }
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM dd, yyyy');
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

// A short line describing an encounter document (report) by its type-specific summary.
function documentSummary(d: PatientResult): string {
  if (d.imagingSummary) {
    return [d.imagingSummary.modality, d.imagingSummary.bodyPart, d.imagingSummary.impression]
      .filter(Boolean)
      .join(' · ');
  }
  if (d.labSummary) {
    const parts = [`${d.labSummary.itemCount} result${d.labSummary.itemCount === 1 ? '' : 's'}`];
    if (d.labSummary.abnormalCount > 0) parts.push(`${d.labSummary.abnormalCount} abnormal`);
    if (d.labSummary.criticalCount > 0) parts.push(`${d.labSummary.criticalCount} critical`);
    if (d.labSummary.labDiscipline) parts.unshift(d.labSummary.labDiscipline);
    return parts.join(' · ');
  }
  if (d.procedureSummary) {
    return [d.procedureSummary.procedureDescription, d.procedureSummary.complications]
      .filter(Boolean)
      .join(' · ');
  }
  return '';
}

type SectionKey = 'encounter' | 'results' | 'documents' | 'claims' | 'preauth' | 'denials' | 'invoices' | 'policy';

export function EncounterDetailPanel({ encounter }: { encounter?: Encounter }) {
  const router = useRouter();
  const locale = (useParams().locale as string) ?? 'en';
  const encounterId = encounter?.id;

  const { data: claimsData, isLoading: claimsLoading } = useClaims(encounterId ? { encounterId } : undefined);
  const { data: preauthData, isLoading: preauthLoading } = usePreAuthRequests(encounterId ? { encounterId } : undefined);
  const { data: coverages, isLoading: coveragesLoading } = useEncounterCoverages(encounterId);
  const { data: results, isLoading: resultsLoading } = useEncounterObservations(encounterId);
  const { data: documentsData, isLoading: documentsLoading } = useEncounterResults(encounterId ?? '');
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(encounterId ? { encounterId } : undefined);
  const { data: denialsData, isLoading: denialsLoading } = useDenials(encounterId ? { encounterId } : undefined);
  const { data: staff } = useStaffList();
  const draftAppeal = useDraftAppeal();
  const fileAppeal = useFileAppeal();

  const providerName = React.useMemo(() => {
    if (!encounter?.primaryStaffId) return undefined;
    const s = (staff ?? []).find((m) => m.id === encounter.primaryStaffId);
    return s ? s.displayName || `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() : undefined;
  }, [staff, encounter?.primaryStaffId]);

  const claims = encounterId ? claimsData?.claims ?? [] : [];
  const preauths = encounterId ? preauthData?.requests ?? [] : [];
  const encounterCoverages = coverages ?? [];
  const encounterResults = results ?? [];
  const documents = encounterId ? documentsData ?? [] : [];
  const invoices = encounterId ? invoicesData ?? [] : [];
  const denials = encounterId ? denialsData?.denials ?? [] : [];

  // Encounter financials derived from its invoices.
  const financials = React.useMemo(() => {
    const inv = encounterId ? invoicesData ?? [] : [];
    if (inv.length === 0) return null;
    const sum = (pick: (i: (typeof inv)[number]) => number | null | undefined) =>
      inv.reduce((acc, row) => acc + (Number(pick(row)) || 0), 0);
    return {
      currency: inv[0]?.currency ?? null,
      billed: sum((i) => i.netAmount),
      paid: sum((i) => i.amountPaid),
      owes: sum((i) => i.balanceDue),
    };
  }, [invoicesData, encounterId]);

  const refs = React.useRef<Record<SectionKey, HTMLDivElement | null>>({
    encounter: null,
    results: null,
    documents: null,
    claims: null,
    preauth: null,
    denials: null,
    invoices: null,
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
    { key: 'results', label: `Results · ${encounterResults.length}` },
    { key: 'documents', label: `Documents · ${documents.length}` },
    { key: 'claims', label: `Claims · ${claims.length}` },
    { key: 'preauth', label: `Pre-Auth · ${preauths.length}` },
    { key: 'denials', label: `Denials · ${denials.length}` },
    { key: 'invoices', label: `Invoices · ${invoices.length}` },
    { key: 'policy', label: `Policy · ${encounterCoverages.length}` },
  ];

  const setRef = (key: SectionKey) => (el: HTMLDivElement | null) => {
    refs.current[key] = el;
  };

  return (
    <div className="space-y-4">
      {/* Fixed encounter header — stays put while everything below scrolls; actions top-right */}
      <div
        ref={setRef('encounter')}
        className="sticky top-0 z-20 -mx-4 border-b border-border/60 bg-card/95 px-4 pb-3 pt-4 backdrop-blur"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs text-muted-foreground">{encounter.encounterNumber}</p>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">
                {encounter.encounterType || titleCase(encounter.encounterClass)}
              </h3>
              <Badge variant="outline" className="capitalize">{encounter.status}</Badge>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
              <span>
                {[
                  fmtDateTime(encounter.startTime),
                  providerName ? `Dr ${providerName}` : null,
                  encounter.facilityName,
                  encounter.departmentName,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <EncounterClassChip value={encounter.encounterClass} />
              {encounter.priority ? <Chip className="capitalize">{titleCase(encounter.priority)}</Chip> : null}
            </div>
            {encounter.chiefComplaint ? (
              <p className="mt-2 text-sm text-foreground">
                <span className="text-muted-foreground">Chief complaint — </span>
                {encounter.chiefComplaint}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => scrollTo('results')}>
              <FlaskConical className="mr-1.5 h-3.5 w-3.5" /> Results
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(`/${locale}/encounters/${encounter.id}/charting`)}
              title="Open clinical charting for this encounter"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5" /> Clinical charting
            </Button>
          </div>
        </div>
      </div>

      {/* Financials — derived from the encounter's invoices */}
      <div className="grid grid-cols-3 gap-2">
        {([
          ['Total Billed', financials?.billed],
          ['Total Paid', financials?.paid],
          ['Patient Owes', financials?.owes],
        ] as const).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/60 bg-card/60 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">{label}</p>
            <p className="mt-0.5 text-base font-semibold text-foreground">
              {value == null ? '—' : money(value, financials?.currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Section nav — scrolls with the content; clicking jumps to the section */}
      <div className="-mx-4 flex gap-1 overflow-x-auto border-b border-border/60 bg-card/95 px-4 py-2">
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
        <section ref={setRef('results')} className="scroll-mt-36 space-y-2">
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

        {/* Documents — reports (lab / imaging / procedure) produced for this encounter */}
        <section ref={setRef('documents')} className="scroll-mt-36 space-y-2">
          <SectionLabel>Documents</SectionLabel>
          {documentsLoading ? (
            <LoadingSpinner size="sm" text="Loading documents..." />
          ) : documents.length === 0 ? (
            <EmptyState>No documents recorded for this encounter.</EmptyState>
          ) : (
            <div className="space-y-2">
              {documents.map((d) => (
                <div key={d.id} className="rounded-lg border border-border/60 bg-card/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{d.orderName}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.reportedAt ? fmtDateTime(d.reportedAt) : 'Not yet reported'}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Chip className="capitalize">{d.reportType}</Chip>
                      <Badge variant="outline" className="capitalize">{d.reportStatus.toLowerCase()}</Badge>
                    </div>
                  </div>
                  {documentSummary(d) ? (
                    <p className="mt-1.5 pl-6 text-xs leading-relaxed text-muted-foreground">{documentSummary(d)}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Claims */}
        <section ref={setRef('claims')} className="scroll-mt-36 space-y-2">
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
        <section ref={setRef('preauth')} className="scroll-mt-36 space-y-2">
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

        {/* Denials & appeals */}
        <section ref={setRef('denials')} className="scroll-mt-36 space-y-2">
          <SectionLabel>Denials & Appeals</SectionLabel>
          {denialsLoading ? (
            <LoadingSpinner size="sm" text="Loading denials..." />
          ) : denials.length === 0 ? (
            <EmptyState>No denials for this encounter.</EmptyState>
          ) : (
            denials.map((d) => {
              const draft = d.appeals?.find((a) => a.status === 'draft');
              const filed = d.appeals?.find((a) => a.status !== 'draft');
              return (
                <div key={d.id} className="space-y-2 rounded-lg border border-border/60 bg-card/40 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertOctagon className="mt-0.5 h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          <span className="font-mono">{d.denialCode}</span> · {money(d.deniedAmount, d.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">{d.denialReason}</p>
                        {d.appealDeadline ? (
                          <p className="mt-0.5 text-xs text-muted-foreground">Appeal by {fmtDate(d.appealDeadline)}</p>
                        ) : null}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">{String(d.status).toLowerCase()}</Badge>
                  </div>
                  <div>
                    {filed ? (
                      <Badge variant="secondary" className="capitalize">Appeal {String(filed.status)}</Badge>
                    ) : draft ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={fileAppeal.isPending}
                        onClick={() => fileAppeal.mutate({ appealId: draft.id })}
                      >
                        File appeal
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={draftAppeal.isPending}
                        onClick={() =>
                          draftAppeal.mutate({
                            denialId: d.id,
                            payload: { narrative: `Appeal for ${d.denialCode}: ${d.denialReason}` },
                          })
                        }
                      >
                        Draft appeal
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Invoices */}
        <section ref={setRef('invoices')} className="scroll-mt-36 space-y-2">
          <SectionLabel>Invoices</SectionLabel>
          {invoicesLoading ? (
            <LoadingSpinner size="sm" text="Loading invoices..." />
          ) : invoices.length === 0 ? (
            <EmptyState>No invoices for this encounter.</EmptyState>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">{inv.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Billed {money(inv.netAmount, inv.currency)} · Paid {money(inv.amountPaid, inv.currency)} · Due{' '}
                      {money(inv.balanceDue, inv.currency)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{String(inv.status).toLowerCase()}</Badge>
              </div>
            ))
          )}
        </section>

        {/* Encounter-level Policy */}
        <section ref={setRef('policy')} className="scroll-mt-36 space-y-2">
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
