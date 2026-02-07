'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { usePreAuthRequest, useSubmitPreAuth } from '@/modules/rcm/hooks/use-preauth';
import type { PreAuthStatus } from '@/modules/rcm/types/preauth';

const statusLabels: Record<PreAuthStatus, string> = {
  draft: 'Draft',
  pending: 'Pending',
  submitted: 'Submitted',
  approved: 'Approved',
  partially_approved: 'Partially approved',
  denied: 'Denied',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

export default function PreAuthDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: request, isLoading, error } = usePreAuthRequest(id);
  const submitMutation = useSubmitPreAuth();

  const handleSubmit = async () => {
    await submitMutation.mutateAsync(id);
    toast({ title: 'Pre-auth submitted' });
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !request) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load pre-auth: ${(error as Error).message}` : 'Request not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/preauth`} aria-label="Back to pre-auth">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Pre-auth #{request.internalRef}</p>
          <h1 className="text-3xl font-bold">Pre-auth request</h1>
        </div>
        <Badge variant="secondary">{statusLabels[request.status]}</Badge>
        <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
          <Send className="mr-2 h-4 w-4" /> Submit
        </Button>
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
            <p className="text-muted-foreground">Urgency</p>
            <p>{request.urgency ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Authorization #</p>
            <p>{request.authorizationNumber ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requested services</CardTitle>
        </CardHeader>
        <CardContent>
          {request.requestedServices?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(request.requestedServices, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No services captured.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
