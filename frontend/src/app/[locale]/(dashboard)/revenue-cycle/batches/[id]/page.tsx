'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileOutput, PackageCheck, Send } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  useAddClaimsToBatch,
  useBatch,
  useCloseBatch,
  useGenerateBatchFile,
  useRemoveClaimsFromBatch,
  useSubmitBatch,
} from '@/modules/rcm/hooks/use-batches';
import type { BatchStatus } from '@/modules/rcm/types/batches';

const statusLabels: Record<BatchStatus, string> = {
  open: 'Open',
  closed: 'Closed',
  submitting: 'Submitting',
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  rejected: 'Rejected',
  partially_processed: 'Partially processed',
};

export default function BatchDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;
  const toast = useToast();

  const { data: batch, isLoading, error } = useBatch(id);
  const addClaims = useAddClaimsToBatch();
  const removeClaims = useRemoveClaimsFromBatch();
  const closeBatch = useCloseBatch();
  const generateFile = useGenerateBatchFile();
  const submitBatch = useSubmitBatch();

  const [claimIdsInput, setClaimIdsInput] = useState('');
  const claimIds = useMemo(
    () => claimIdsInput.split(',').map((idValue) => idValue.trim()).filter(Boolean),
    [claimIdsInput],
  );

  const handleAddClaims = async () => {
    if (claimIds.length === 0) return;
    await addClaims.mutateAsync({ id, claimIds });
    setClaimIdsInput('');
    toast({ title: 'Claims added to batch' });
  };

  const handleRemoveClaims = async () => {
    if (claimIds.length === 0) return;
    await removeClaims.mutateAsync({ id, claimIds });
    setClaimIdsInput('');
    toast({ title: 'Claims removed from batch' });
  };

  const handleClose = async () => {
    await closeBatch.mutateAsync(id);
    toast({ title: 'Batch closed' });
  };

  const handleGenerate = async () => {
    const result = await generateFile.mutateAsync(id);
    if (result.success) {
      toast({ title: 'Batch file generated', description: result.generatedFile?.filename });
    } else {
      toast({ variant: 'destructive', title: 'Generation failed', description: result.error });
    }
  };

  const handleSubmit = async () => {
    await submitBatch.mutateAsync(id);
    toast({ title: 'Batch submitted' });
  };

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded bg-muted" />;
  }

  if (error || !batch) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load batch: ${(error as Error).message}` : 'Batch not found.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/revenue-cycle/batches`} aria-label="Back to batches">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Batch #{batch.batchNumber}</p>
          <h1 className="text-3xl font-bold">{batch.claimCount} claims</h1>
        </div>
        <Badge variant="secondary">{statusLabels[batch.status]}</Badge>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={closeBatch.isPending}>
            <PackageCheck className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button variant="outline" onClick={handleGenerate} disabled={generateFile.isPending}>
            <FileOutput className="mr-2 h-4 w-4" /> Generate file
          </Button>
          <Button onClick={handleSubmit} disabled={submitBatch.isPending}>
            <Send className="mr-2 h-4 w-4" /> Submit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Format</p>
            <p>{batch.claimFormat}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payer ID</p>
            <p className="font-mono">{batch.payerId ?? '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total amount</p>
            <p>{batch.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Batch type</p>
            <p>{batch.batchType ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage claims in batch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Claim IDs (comma separated)</Label>
            <Textarea
              value={claimIdsInput}
              onChange={(event) => setClaimIdsInput(event.target.value)}
              placeholder="claim-id-1, claim-id-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleAddClaims} disabled={addClaims.isPending}>
              Add claims
            </Button>
            <Button type="button" variant="outline" onClick={handleRemoveClaims} disabled={removeClaims.isPending}>
              Remove claims
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {batch.claims?.length ? (
            <pre className="rounded-md bg-muted p-4 text-xs overflow-auto">
              {JSON.stringify(batch.claims, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No claims attached to this batch.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
