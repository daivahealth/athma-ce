'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ReceiptForm } from '@/modules/rcm/components/receipt-form';
import { useCreateReceipt } from '@/modules/rcm/hooks/use-receipts';
import type { CreateReceiptInput } from '@/modules/rcm/types/receipt';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

export default function NewReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createReceipt = useCreateReceipt();
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const currencyLabel =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value
      : 'AED';

  const handleSubmit = async (payload: CreateReceiptInput) => {
    await createReceipt.mutateAsync(payload);
    toast({ title: 'Receipt created' });
    router.push(`/${locale}/receipts`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/receipts`} aria-label="Back to receipts">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            Create receipt
            <Badge variant="secondary">{currencyLabel}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptForm
            onSubmit={handleSubmit}
            isSubmitting={createReceipt.isPending}
            showCurrencyField={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
