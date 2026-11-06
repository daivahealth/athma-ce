'use client';

import { useParams, useRouter } from 'next/navigation';
import { Handshake } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { useToast } from '@/components/ui/use-toast';
import { PayerContractForm } from '@/modules/rcm/components/payer-contract-form';
import { useCreatePayerContract } from '@/modules/rcm/hooks/use-payer-contracts';
import type { CreatePayerContractInput } from '@/modules/rcm/types/payer-contract';

export default function NewPayerContractPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createContract = useCreatePayerContract();

  const handleSubmit = async (payload: CreatePayerContractInput) => {
    await createContract.mutateAsync(payload);
    toast({ title: 'Contract created' });
    router.push(`/${locale}/rcm-setup/payer-contracts`);
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New payer contract"
        subtitle="Agree pricing terms with an insurer or payer"
        icon={Handshake}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${locale}/rcm-setup`, label: 'RCM Setup' },
              { href: `/${locale}/rcm-setup/payer-contracts`, label: 'Payer contracts' },
              { label: 'New' },
            ]}
          />
        }
      />

      <PayerContractForm
        onSubmit={handleSubmit}
        isSubmitting={createContract.isPending}
        onCancel={() => router.push(`/${locale}/rcm-setup/payer-contracts`)}
      />
    </div>
  );
}
