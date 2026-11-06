import { Skeleton } from '@/components/ui/skeleton';

/** Shared building blocks so the lab worklists read as one family. */

export function patientInitials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
}

function formatGender(gender?: string | null) {
  if (!gender) return null;
  return gender[0].toUpperCase() + gender.slice(1).toLowerCase();
}

export function LabPatientCell({
  name,
  mrn,
  age,
  gender,
}: {
  name?: string | null;
  mrn?: string | null;
  age?: number | null;
  gender?: string | null;
}) {
  const genderLabel = formatGender(gender);
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
        aria-hidden="true"
      >
        {patientInitials(name)}
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium text-foreground">{name || 'Unknown patient'}</div>
        <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          <span className="font-mono">{mrn || '—'}</span>
          {genderLabel || age != null ? <span aria-hidden="true">·</span> : null}
          {genderLabel ? <span>{genderLabel}</span> : null}
          {age != null ? <span>{age}y</span> : null}
        </div>
      </div>
    </div>
  );
}

/** A specimen's barcode as the thing a tech scans for: monospaced, on a quiet chip. */
export function SpecimenCode({ value }: { value?: string | null }) {
  if (!value) return <span className="text-xs text-muted-foreground">Not labelled</span>;
  return (
    <span className="inline-flex rounded-md border border-border/70 bg-muted/50 px-1.5 py-0.5 font-mono text-xs text-foreground">
      {value}
    </span>
  );
}

export function WorklistSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border/60" aria-busy="true" aria-label="Loading worklist">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className="size-9 rounded-full" />
          <div className="w-44 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function formatLabDateTime(value?: string | Date | null) {
  if (!value) return null;
  const date = new Date(value);
  return {
    day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export function LabDateTime({ value, empty = '—' }: { value?: string | Date | null; empty?: string }) {
  const formatted = formatLabDateTime(value);
  if (!formatted) return <span className="text-xs text-muted-foreground">{empty}</span>;
  return (
    <div>
      <div className="text-sm text-foreground">{formatted.day}</div>
      <div className="text-xs text-muted-foreground">{formatted.time}</div>
    </div>
  );
}
