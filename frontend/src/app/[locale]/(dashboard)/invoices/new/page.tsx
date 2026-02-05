'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { InvoiceForm } from '@/modules/rcm/components/invoice-form';
import { useCreateInvoice } from '@/modules/rcm/hooks/use-invoices';
import type { CreateInvoiceInput } from '@/modules/rcm/types/invoice';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

export default function NewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createInvoice = useCreateInvoice();
  const { data: currencyConfig } = useResolveConfig('finance.currency');
  const currencyLabel =
    typeof currencyConfig?.value === 'string' && currencyConfig.value.trim()
      ? currencyConfig.value
      : 'AED';

  const handleSubmit = async (payload: CreateInvoiceInput) => {
    await createInvoice.mutateAsync(payload);
    toast({ title: 'Invoice created' });
    router.push(`/${locale}/invoices`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${locale}/invoices`} aria-label="Back to invoices">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            Create invoice
            <Badge variant="secondary">{currencyLabel}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            onSubmit={handleSubmit}
            isSubmitting={createInvoice.isPending}
            showCurrencyField={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
