'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, ShieldCheck, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useClaim, useSubmitClaim, useValidateClaim } from '@/modules/rcm/hooks/use-claims';
import type { ClaimStatus } from '@/modules/rcm/types/claims';

const statusLabels: Record<ClaimStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  ready: 'Ready',
  scrubbing: 'Scrubbing',
  validated: 'Validated',
  failed_validation: 'Failed validation',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  rejected: 'Rejected',
  pending_adjudication: 'Pending adjudication',
  adjudicated: 'Adjudicated',
  paid: 'Paid',
  partially_paid: 'Partially paid',
  denied: 'Denied',
  appealed: 'Appealed',
  cancelled: 'Cancelled',
};

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: claim, isLoading, error } = useClaim(id);
  const validateMutation = useValidateClaim();
  const submitMutation = useSubmitClaim();

  const handleValidate = async () => {
    const result = await validateMutation.mutateAsync(id);
    if (result.isValid) {
      toast({ title: 'Claim validated' });
    } else {
      toast({ variant: 'destructive', title: 'Validation failed', description: 'Review errors below.' });
    }
  };

  const handleSubmit = async () => {
    const result = await submitMutation.mutateAsync(id);
    if (result.success) {
      toast({ title: 'Claim submitted' });
    } else {
      toast({ variant: 'destructive', title: 'Submission failed', description: result.error });
    }
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !claim) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load claim: ${(error as Error).message}` : 'Claim not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/claims`} aria-label="Back to claims">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Claim #{claim.claimNumber}</p>
          <h1 className="text-3xl font-bold">
            {(Number(claim.totalAmount) || 0).toFixed(2)} {claim.currency ?? 'AED'}
          </h1>
        </div>
        <Badge variant="secondary">{statusLabels[claim.status]}</Badge>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleValidate}
            disabled={validateMutation.isPending}
          >
            <ShieldCheck className="mr-2 h-4 w-4" /> Validate
          </Button>
          <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
            <Send className="mr-2 h-4 w-4" /> Submit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Claim overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Patient</p>
            {claim.patientDisplay ? (
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{claim.patientDisplay.displayName || 'Unknown patient'}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>MRN: {claim.patientDisplay.mrn || '—'}</span>
                    <span>&bull;</span>
                    <span>{claim.patientDisplay.gender || '—'} / {claim.patientDisplay.age != null ? `${claim.patientDisplay.age}y` : '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-mono">{claim.patientId.slice(0, 8)}...</p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">Encounter ID</p>
            <p className="font-mono">{claim.encounterId ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payer ID</p>
            <p className="font-mono">{claim.payerId ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Service date</p>
            <p>{claim.serviceDate ? new Date(claim.serviceDate).toLocaleDateString() : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claim lines</CardTitle>
        </CardHeader>
        <CardContent>
          {claim.claimLines?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(claim.claimLines, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No claim lines available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Diagnoses</CardTitle>
        </CardHeader>
        <CardContent>
          {claim.claimDiagnoses?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(claim.claimDiagnoses, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No diagnoses attached.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
