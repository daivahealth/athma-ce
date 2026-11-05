'use client';

import { useParams, useRouter } from 'next/navigation';
import { FilePlus2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create invoice"
        subtitle={`Bill a patient for an encounter's charges · amounts in ${currencyLabel}`}
        icon={FilePlus2}
        breadcrumb={
          <Breadcrumb
            items={[{ href: `/${locale}/invoices`, label: 'Invoices' }, { label: 'New' }]}
          />
        }
        actions={<Badge variant="secondary">{currencyLabel}</Badge>}
      />

      <InvoiceForm
        onSubmit={handleSubmit}
        isSubmitting={createInvoice.isPending}
        showCurrencyField={false}
        onCancel={() => router.push(`/${locale}/invoices`)}
      />
    </div>
  );
}
