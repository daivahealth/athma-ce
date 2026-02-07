'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useRemittance, useReconcileRemittance } from '@/modules/rcm/hooks/use-remittance';
import type { RemittanceStatus } from '@/modules/rcm/types/remittance';

const statusLabels: Record<RemittanceStatus, string> = {
  received: 'Received',
  processing: 'Processing',
  processed: 'Processed',
  reconciled: 'Reconciled',
  error: 'Error',
};

export default function RemittanceDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: remittance, isLoading, error } = useRemittance(id);
  const reconcileMutation = useReconcileRemittance();

  const handleReconcile = async () => {
    const result = await reconcileMutation.mutateAsync(id);
    toast({
      title: 'Remittance reconciled',
      description: `${result.matchedLines} matched, ${result.unmatchedLines} unmatched`,
    });
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !remittance) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load remittance: ${(error as Error).message}` : 'Remittance not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/remittance`} aria-label="Back to remittance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Remittance</p>
          <h1 className="text-3xl font-bold">{remittance.id}</h1>
        </div>
        <Badge variant="secondary">{statusLabels[remittance.status]}</Badge>
        <Button onClick={handleReconcile} disabled={reconcileMutation.isPending}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Reconcile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Remittance details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Payer ID</p>
            <p className="font-mono">{remittance.payerId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Format</p>
            <p>{remittance.format}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payment amount</p>
            <p>{remittance.paymentAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Check number</p>
            <p>{remittance.checkNumber ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lines</CardTitle>
        </CardHeader>
        <CardContent>
          {remittance.lines?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(remittance.lines, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No remittance lines available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
