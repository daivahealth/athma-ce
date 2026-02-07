'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useCreateBatch } from '@/modules/rcm/hooks/use-batches';
import { useClaimFormats } from '@/modules/rcm/hooks/use-claims';
import type { BatchType } from '@/modules/rcm/types/batches';

const batchTypes: BatchType[] = ['professional', 'institutional', 'dental', 'pharmacy'];

export default function NewBatchPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createBatch = useCreateBatch();
  const { data: formats } = useClaimFormats();

  const [batchType, setBatchType] = useState<BatchType | 'all'>('professional');
  const [claimFormat, setClaimFormat] = useState('');
  const [payerId, setPayerId] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!claimFormat.trim()) return;

    await createBatch.mutateAsync({
      batchType: batchType === 'all' ? undefined : batchType,
      claimFormat: claimFormat.trim(),
      payerId: payerId.trim() || undefined,
    });
    toast({ title: 'Batch created' });
    router.push(`/${locale}/revenue-cycle/batches`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/revenue-cycle/batches`} aria-label="Back to batches">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            Create batch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Batch type</Label>
              <Select value={batchType} onValueChange={(value) => setBatchType(value as BatchType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {batchTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Claim format *</Label>
              <Select value={claimFormat} onValueChange={setClaimFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {(formats ?? []).map((format) => (
                    <SelectItem key={format.format} value={format.format}>
                      {format.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Payer ID</Label>
              <Input
                value={payerId}
                onChange={(event) => setPayerId(event.target.value)}
                placeholder="Optional payer UUID"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={createBatch.isPending}>
                Create batch
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
