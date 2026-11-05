'use client';

import { ToneBadge } from '@/components/ui/tone-badge';
import { oncologyStatusTone } from '@/plugins/oncology/lib/oncology-tone';
import type { OncologyPatientDisplay } from '@/plugins/oncology/types';

export function StatusBadge({ status }: { status: string }) {
  return (
    <ToneBadge tone={oncologyStatusTone(status)} withDot className="capitalize">
      {status.toLowerCase().replace(/_/g, ' ')}
    </ToneBadge>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

/** Patient name over MRN · sex · age, for list rows. The MRN keeps its own format (no "MRN:" label). */
export function PatientCell({ patientDisplay }: { patientDisplay?: OncologyPatientDisplay | null }) {
  if (!patientDisplay) return <span className="text-muted-foreground text-xs">—</span>;
  const meta = [
    patientDisplay.gender ? patientDisplay.gender.charAt(0).toUpperCase() + patientDisplay.gender.slice(1) : null,
    patientDisplay.age != null ? `${patientDisplay.age}y` : null,
  ].filter(Boolean).join(' · ');
  return (
    <div className="min-w-0">
      <div className="font-medium">{patientDisplay.displayName}</div>
      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        {patientDisplay.mrn && <span className="font-mono whitespace-nowrap">{patientDisplay.mrn}</span>}
        {meta && <span className="whitespace-nowrap">{meta}</span>}
      </div>
    </div>
  );
}
