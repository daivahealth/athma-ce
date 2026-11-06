'use client';

import { useParams, useRouter } from 'next/navigation';
import { HandCoins } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Create receipt"
        subtitle={`Record a payment received from a patient · base currency ${currencyLabel}`}
        icon={HandCoins}
        breadcrumb={
          <Breadcrumb
            items={[{ href: `/${locale}/receipts`, label: 'Receipts' }, { label: 'New' }]}
          />
        }
        actions={<Badge variant="secondary">{currencyLabel}</Badge>}
      />

      <ReceiptForm
        onSubmit={handleSubmit}
        isSubmitting={createReceipt.isPending}
        showCurrencyField={false}
        onCancel={() => router.push(`/${locale}/receipts`)}
      />
    </div>
  );
}
