'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/rcm-setup/payer-contracts`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to contracts
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New payer contract</CardTitle>
        </CardHeader>
        <CardContent>
          <PayerContractForm onSubmit={handleSubmit} isSubmitting={createContract.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
