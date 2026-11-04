'use client';

import { useParams, useRouter } from 'next/navigation';
import { ReceiptText } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { BillingItemForm } from '@/modules/rcm/components/billing-item-form';
import { useCreateBillingItem } from '@/modules/rcm/hooks/use-billing-items';
import type { CreateBillingItemInput } from '@/modules/rcm/types/billing-item';

export default function NewBillingItemPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const locale = params.locale as string;
  const createMutation = useCreateBillingItem();

  const handleSubmit = async (payload: CreateBillingItemInput) => {
    await createMutation.mutateAsync(payload);
    toast({ title: 'Billing item created' });
    router.push(`/${locale}/rcm-setup/billing-items`);
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New billing item"
        subtitle="Add a billable code to the charge master"
        icon={ReceiptText}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${locale}/rcm-setup`, label: 'RCM Setup' },
              { href: `/${locale}/rcm-setup/billing-items`, label: 'Billing items' },
              { label: 'New' },
            ]}
          />
        }
      />

      <BillingItemForm
        submitLabel="Create billing item"
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${locale}/rcm-setup/billing-items`)}
      />
    </div>
  );
}
