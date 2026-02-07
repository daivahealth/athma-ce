'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEligibilityRequest } from '@/modules/rcm/hooks/use-eligibility';
import type { EligibilityStatus } from '@/modules/rcm/types/eligibility';

const statusLabels: Record<EligibilityStatus, string> = {
  accepted: 'Accepted',
  rejected: 'Rejected',
  error: 'Error',
};

export default function EligibilityDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;

  const { data: request, isLoading, error } = useEligibilityRequest(id);

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !request) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load request: ${(error as Error).message}` : 'Request not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/eligibility`} aria-label="Back to eligibility">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Eligibility request</p>
          <h1 className="text-3xl font-bold">{request.id}</h1>
        </div>
        {request.status && <Badge variant="secondary">{statusLabels[request.status]}</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Patient</p>
            {request.patientDisplay ? (
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{request.patientDisplay.displayName || 'Unknown patient'}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>MRN: {request.patientDisplay.mrn || '—'}</span>
                    <span>&bull;</span>
                    <span>{request.patientDisplay.gender || '—'} / {request.patientDisplay.age != null ? `${request.patientDisplay.age}y` : '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-mono">{request.patientId.slice(0, 8)}...</p>
            )}
          </div>
          <div>
            <p className="text-muted-foreground">Payer ID</p>
            <p className="font-mono">{request.payerId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Policy ID</p>
            <p className="font-mono">{request.policyId ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Encounter ID</p>
            <p className="font-mono">{request.encounterId ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Request type</p>
            <p>{request.requestType ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Service date</p>
            <p>{request.serviceDate ? new Date(request.serviceDate).toLocaleDateString() : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits summary</CardTitle>
        </CardHeader>
        <CardContent>
          {request.benefitsSummary ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(request.benefitsSummary, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No benefits summary available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Errors</CardTitle>
        </CardHeader>
        <CardContent>
          {request.errors?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(request.errors, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No errors recorded.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
