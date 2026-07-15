'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/** Small muted label above a value, used throughout the Care Context rail/panels. */
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70', className)}>
      {children}
    </p>
  );
}

/** A label/value pair on a single line — label left, value right-aligned. */
export function Field({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="shrink-0 pt-px text-xs text-muted-foreground">{label}</p>
      <div className="min-w-0 break-words text-right text-sm font-medium text-foreground">{value ?? '—'}</div>
    </div>
  );
}

/** A compact metric tile (vitals). */
export function StatTile({ label, value, unit }: { label: string; value: React.ReactNode; unit?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">{label}</p>
      <p className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
        {value}
        {unit ? <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span> : null}
      </p>
    </div>
  );
}

/** Renders a comma/newline-separated string or a string[] as chips, with an empty fallback. */
export function ChipList({ value, empty }: { value?: string | string[] | null; empty: string }) {
  const items = (Array.isArray(value) ? value : (value ?? '').split(/[,;\n]/))
    .map((s) => s.trim())
    .filter(Boolean);
  if (items.length === 0) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * Honest placeholder for capabilities that need a backend service not yet built
 * (AI narrative, denials, claim-pipeline orchestration, ABDM/HIE, notifications).
 * Never fabricates data.
 */
export function FeaturePlaceholder({
  title,
  detail,
  requires,
}: {
  title: string;
  detail: string;
  requires?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-muted-foreground">{detail}</p>
      {requires ? (
        <p className="mt-2 text-xs text-muted-foreground/70">Requires: {requires}</p>
      ) : null}
    </div>
  );
}

/** Simple empty-state line. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

// HL7 v3 ActEncounterCode → readable label (falls back to the raw code).
const ENCOUNTER_CLASS_LABELS: Record<string, string> = {
  AMB: 'Ambulatory',
  IMP: 'Inpatient',
  EMER: 'Emergency',
  ACUTE: 'Acute',
  NONAC: 'Non-acute',
  OBSENC: 'Observation',
  PRENC: 'Pre-admission',
  SS: 'Short stay',
  VR: 'Virtual',
  HH: 'Home health',
  FLD: 'Field',
};

/** A small neutral chip used for encounter metadata (class, priority, …). */
export function Chip({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground',
        className,
      )}
      title={title}
    >
      {children}
    </span>
  );
}

/** A small chip labelling an encounter's class (e.g. Ambulatory, Inpatient). */
export function EncounterClassChip({ value, className }: { value?: string | null; className?: string }) {
  const raw = (value ?? '').trim();
  if (!raw) return null;
  const label = ENCOUNTER_CLASS_LABELS[raw.toUpperCase()] ?? raw;
  return (
    <Chip className={className} title={`Encounter class · ${label}`}>
      {label}
    </Chip>
  );
}
