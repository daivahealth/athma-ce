import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';

/** The patient fields RCM records carry: a resolved display, or the name/MRN stored on the record. */
export interface PatientIdentitySource {
  patientId?: string | null;
  patientDisplayName?: string | null;
  mrn?: string | null;
  patientDisplay?: {
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    mrn?: string | null;
    gender?: string | null;
    age?: number | null;
  } | null;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function genderLabel(gender?: string | null) {
  if (!gender) return null;
  const g = gender.toLowerCase();
  if (g === 'm' || g === 'male') return 'Male';
  if (g === 'f' || g === 'female') return 'Female';
  return g.charAt(0).toUpperCase() + g.slice(1);
}

/**
 * A patient as billing and OT screens show them: initials avatar, name, MRN chip,
 * gender and age. Matches the encounter and lab worklists. When the patient
 * could not be resolved it says so instead of showing a raw id (the id stays
 * in the tooltip for support).
 *
 * `size="sm"` is for table rows, `size="lg"` for detail-page summary cards.
 */
export function PatientIdentity({
  source,
  size = 'sm',
  className,
}: {
  source: PatientIdentitySource;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const pd = source.patientDisplay;
  const name =
    pd?.displayName?.trim() ||
    [pd?.firstName, pd?.lastName].filter(Boolean).join(' ').trim() ||
    source.patientDisplayName?.trim() ||
    '';
  const mrn = pd?.mrn || source.mrn || null;
  const gender = genderLabel(pd?.gender);
  const age = pd?.age ?? null;
  const lg = size === 'lg';

  const avatarClass = cn(
    'flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset',
    lg ? 'size-12 text-sm' : 'size-9 text-xs',
  );

  if (!name && !mrn) {
    return (
      <div className={cn('flex items-center gap-3', className)} title={source.patientId ?? undefined}>
        <span className={cn(avatarClass, 'bg-muted text-muted-foreground ring-border')} aria-hidden="true">
          <UserRound className={lg ? 'size-5' : 'size-4'} />
        </span>
        <div className="min-w-0">
          <div className={cn('font-medium text-muted-foreground', lg && 'text-base')}>Patient details unavailable</div>
          {source.patientId && (
            <div className="truncate font-mono text-xs text-muted-foreground/80">
              ID {source.patientId.slice(0, 8)}
            </div>
          )}
        </div>
      </div>
    );
  }

  const meta = [gender, age != null ? `${age} yrs` : null].filter(Boolean) as string[];

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <span className={cn(avatarClass, 'bg-primary/10 text-primary ring-primary/15')} aria-hidden="true">
        {name ? initials(name) : <UserRound className={lg ? 'size-5' : 'size-4'} />}
      </span>
      <div className="min-w-0">
        <div className={cn('truncate font-medium text-foreground', lg && 'text-base font-semibold')}>
          {name || 'Unnamed patient'}
        </div>
        <div
          className={cn(
            'flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground',
            lg ? 'mt-1' : 'mt-0.5',
          )}
        >
          {mrn && (
            <span className="inline-flex items-center rounded-md border border-border/70 bg-muted/50 px-1.5 py-px font-mono text-[11px] leading-4 text-foreground/80">
              {mrn}
            </span>
          )}
          {meta.length > 0 && <span className="whitespace-nowrap">{meta.join(' · ')}</span>}
        </div>
      </div>
    </div>
  );
}
