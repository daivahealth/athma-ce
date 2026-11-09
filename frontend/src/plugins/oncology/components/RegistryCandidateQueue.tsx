'use client';

import { useState } from 'react';
import { FileSearch, FlaskConical, Microscope, ScanLine, Stethoscope, UserPlus, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToneBadge, type BadgeTone } from '@/components/ui/tone-badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { LoadingState, PatientCell } from './shared';
import { useDismissRegistryCandidate } from '../hooks/use-oncology';
import type {
  RegistryCandidate,
  RegistryCandidateSourceType,
  RegistryCandidateStrength,
} from '../types';

const SOURCE_META: Record<RegistryCandidateSourceType, { label: string; icon: LucideIcon }> = {
  pathology: { label: 'Pathology', icon: Microscope },
  imaging: { label: 'Imaging', icon: ScanLine },
  diagnosis: { label: 'Coded diagnosis', icon: Stethoscope },
  tumor_marker: { label: 'Tumour marker', icon: FlaskConical },
};

export const STRENGTH_META: Record<RegistryCandidateStrength, { label: string; tone: BadgeTone; hint: string }> = {
  high: { label: 'Confirmed', tone: 'red', hint: 'Malignant pathology or a coded cancer diagnosis' },
  medium: { label: 'Suspected', tone: 'amber', hint: 'Imaging suspicious for malignancy — tissue diagnosis pending' },
  low: { label: 'Indicative', tone: 'slate', hint: 'Raised tumour marker only' },
};

const dateFmt = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
export const formatResultDate = (iso: string | null) => (iso ? dateFmt.format(new Date(iso)) : '—');

/** The evidence rows for one candidate: what the result was and why it was flagged. */
export function CandidateEvidenceList({ candidate }: { candidate: RegistryCandidate }) {
  return (
    <ul className="space-y-2">
      {candidate.evidence.map((e) => {
        const meta = SOURCE_META[e.sourceType];
        const Icon = meta.icon;
        return (
          <li key={`${e.sourceType}:${e.sourceId}`} className="flex gap-3 rounded-md border bg-muted/20 p-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-medium">{meta.label}</span>
                <span className="text-muted-foreground">·</span>
                <span className="min-w-0 truncate">{e.title}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{formatResultDate(e.resultAt)}</span>
                <ToneBadge tone={STRENGTH_META[e.strength].tone}>{STRENGTH_META[e.strength].label}</ToneBadge>
              </div>
              <p className="text-sm text-foreground/90 break-words">“{e.excerpt}”</p>
              {e.matchedTerms.length > 0 && e.sourceType !== 'diagnosis' && e.sourceType !== 'tumor_marker' && (
                <div className="flex flex-wrap gap-1">
                  {e.matchedTerms.map((t) => (
                    <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

interface QueueProps {
  candidates: RegistryCandidate[];
  isLoading: boolean;
  onAdd: (candidate: RegistryCandidate) => void;
}

/**
 * The registry candidate queue: patients not yet in the registry whose recent
 * results suggest cancer. Each row shows the evidence; the user adds the
 * patient to the registry or dismisses the finding with a reason.
 */
export function RegistryCandidateQueue({ candidates, isLoading, onAdd }: QueueProps) {
  const [dismissing, setDismissing] = useState<RegistryCandidate | null>(null);

  if (isLoading) return <LoadingState />;

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-60 border rounded-lg bg-muted/20 px-4 text-center">
        <FileSearch className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">No patients waiting for review</p>
        <p className="text-xs text-muted-foreground max-w-md">
          Patients appear here when a finalised biopsy or pathology report, imaging report, coded diagnosis or
          tumour marker suggests cancer and they are not yet in the registry.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {candidates.map((c) => {
          const strength = STRENGTH_META[c.strength];
          return (
            <section key={c.patientId} className="rounded-lg border bg-card p-4 space-y-3" aria-label={c.patientDisplay?.displayName ?? 'Candidate'}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <PatientCell patientDisplay={c.patientDisplay} />
                  <ToneBadge tone={strength.tone} withDot title={strength.hint}>{strength.label}</ToneBadge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDismissing(c)}>
                    <X className="h-4 w-4 mr-1.5" />
                    Dismiss
                  </Button>
                  <Button size="sm" onClick={() => onAdd(c)}>
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    Add to Registry
                  </Button>
                </div>
              </div>
              <CandidateEvidenceList candidate={c} />
            </section>
          );
        })}
      </div>
      <DismissCandidateDialog candidate={dismissing} onClose={() => setDismissing(null)} />
    </>
  );
}

const DISMISS_REASONS = [
  'Not a cancer case on review',
  'Already registered at another centre',
  'Result entered in error',
];

function DismissCandidateDialog({ candidate, onClose }: { candidate: RegistryCandidate | null; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const dismiss = useDismissRegistryCandidate();
  const { toast } = useToast();

  const close = () => { setReason(''); onClose(); };

  const submit = async () => {
    if (!candidate || !reason.trim()) return;
    try {
      await dismiss.mutateAsync({
        patientId: candidate.patientId,
        reason: reason.trim(),
        sources: candidate.evidence.map((e) => ({ sourceType: e.sourceType, sourceId: e.sourceId })),
      });
      toast({ title: 'Candidate dismissed', description: `${candidate.patientDisplay?.displayName ?? 'Patient'} was removed from the queue.` });
      close();
    } catch {
      toast({ title: 'Could not dismiss', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={!!candidate} onOpenChange={(o) => { if (!o) close(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dismiss candidate</DialogTitle>
          <DialogDescription>
            {candidate?.patientDisplay?.displayName ?? 'This patient'} leaves the queue. A new result that suggests
            cancer will bring them back.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="dismiss-reason">Reason</Label>
          <div className="flex flex-wrap gap-1.5">
            {DISMISS_REASONS.map((r) => (
              <Button key={r} type="button" variant={reason === r ? 'secondary' : 'outline'} size="sm" className="h-7 text-xs" onClick={() => setReason(r)}>
                {r}
              </Button>
            ))}
          </div>
          <Textarea id="dismiss-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Why is this not a registry case?" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button onClick={submit} disabled={!reason.trim() || dismiss.isPending}>
            {dismiss.isPending ? 'Dismissing...' : 'Dismiss'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
