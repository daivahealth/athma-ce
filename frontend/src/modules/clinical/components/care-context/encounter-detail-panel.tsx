'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Zap, FileText, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/loading';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { useClaims } from '@/modules/rcm/hooks/use-claims';
import { usePreAuthRequests } from '@/modules/rcm/hooks/use-preauth';
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

export function EncounterDetailPanel({ encounter }: { encounter?: Encounter }) {
  const encounterId = encounter?.id;

  const { data: claimsData, isLoading: claimsLoading } = useClaims(encounterId ? { encounterId } : undefined);
  const { data: preauthData, isLoading: preauthLoading } = usePreAuthRequests(encounterId ? { encounterId } : undefined);

  const claims = encounterId ? claimsData?.claims ?? [] : [];
  const preauths = encounterId ? preauthData?.requests ?? [] : [];

  if (!encounter) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8">
        <EmptyState>Select an encounter to view its details and claim pipeline.</EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{encounter.encounterNumber}</p>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-foreground">{titleCase(encounter.encounterClass)}</h3>
            <Badge variant="outline" className="capitalize">{encounter.status}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{fmtDateTime(encounter.startTime)}</p>
        </div>
        <Button variant="default" size="sm" disabled title="Requires claim-pipeline orchestration (follow-up)">
          <Zap className="mr-1.5 h-3.5 w-3.5" /> Run claim pipeline
        </Button>
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
      <p className="text-xs text-muted-foreground/70">
        Aggregate financials compose charges + remittance + ledger; a per-encounter summary endpoint is a follow-up.
      </p>

      <Separator />

      <Tabs defaultValue="encounter">
        <TabsList>
          <TabsTrigger value="encounter">Encounter</TabsTrigger>
          <TabsTrigger value="claims">Claims · {claims.length}</TabsTrigger>
          <TabsTrigger value="preauth">Pre-Auth · {preauths.length}</TabsTrigger>
          <TabsTrigger value="denials">Denials</TabsTrigger>
        </TabsList>

        {/* Encounter info */}
        <TabsContent value="encounter" className="space-y-3 pt-3">
          <SectionLabel>Encounter Info</SectionLabel>
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-card/40 p-4">
            <Field label="Encounter #" value={<span className="font-mono">{encounter.encounterNumber}</span>} />
            <Field label="Class" value={titleCase(encounter.encounterClass)} />
            <Field label="Status" value={<span className="capitalize">{encounter.status}</span>} />
            <Field label="Priority" value={<span className="capitalize">{encounter.priority || '—'}</span>} />
            <Field label="Start" value={fmtDateTime(encounter.startTime)} />
            <Field label="End" value={fmtDateTime(encounter.endTime)} />
          </div>
        </TabsContent>

        {/* Claims */}
        <TabsContent value="claims" className="space-y-2 pt-3">
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
        </TabsContent>

        {/* Pre-Auth */}
        <TabsContent value="preauth" className="space-y-2 pt-3">
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
        </TabsContent>

        {/* Denials — greenfield */}
        <TabsContent value="denials" className="pt-3">
          <FeaturePlaceholder
            title="Denials & appeals not yet available"
            detail="Denial codes (e.g. CO-197), appeal drafting, and appeal deadlines require a dedicated RCM denials module. Denied claims currently surface only as a claim status."
            requires="rcm denials + appeals module"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
