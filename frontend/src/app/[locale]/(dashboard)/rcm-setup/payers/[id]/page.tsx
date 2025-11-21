'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePayer, useArchivePayer } from '@/modules/rcm/hooks/use-payers';
import { PayerStatus } from '@/modules/rcm/types/payer';
import { useToast } from '@/components/ui/use-toast';

const statusVariant: Record<PayerStatus, 'default' | 'secondary' | 'outline'> = {
  [PayerStatus.ACTIVE]: 'default',
  [PayerStatus.INACTIVE]: 'secondary',
  [PayerStatus.SUSPENDED]: 'outline',
};

export default function PayerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const payerId = params.id as string;
  const toast = useToast();

  const { data: payer, isLoading, error } = usePayer(payerId);
  const { mutateAsync: archivePayer, isPending } = useArchivePayer();
  const [isArchiving, setIsArchiving] = useState(false);

  const formattedContact = useMemo(() => JSON.stringify(payer?.contactInfo ?? {}, null, 2), [payer]);
  const formattedConfig = useMemo(() => JSON.stringify(payer?.configuration ?? {}, null, 2), [payer]);

  if (isLoading) {
    return <div className="h-32 animate-pulse rounded bg-muted" />;
  }

  if (error || !payer) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {error ? `Unable to load payer: ${(error as Error).message}` : 'Payer not found.'}
      </div>
    );
  }

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      await archivePayer(payer.id);
      toast({ title: 'Payer deactivated', description: `${payer.payerName} moved to inactive.` });
      router.push(`/${locale}/rcm-setup/payers`);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to deactivate payer',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/rcm-setup/payers`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to payers
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{payer.payerName}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={statusVariant[payer.status]}>{payer.status}</Badge>
          {payer.status !== PayerStatus.INACTIVE && (
            <Button variant="outline" className="text-destructive" disabled={isArchiving} onClick={handleArchive}>
              {isArchiving ? 'Archiving...' : 'Deactivate'}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identifiers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Payer ID</p>
            <p className="font-medium">{payer.payerId || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{payer.payerType || '—'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p>{new Date(payer.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p>{new Date(payer.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact info</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded bg-muted/40 p-4 text-sm font-mono whitespace-pre-wrap break-words">
            {formattedContact}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="rounded bg-muted/40 p-4 text-sm font-mono whitespace-pre-wrap break-words">
            {formattedConfig}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
