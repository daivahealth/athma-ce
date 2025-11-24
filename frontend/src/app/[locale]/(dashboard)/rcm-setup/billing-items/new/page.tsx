'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/rcm-setup/billing-items`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to billing items
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New billing item</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingItemForm
            submitLabel="Create billing item"
            isSubmitting={createMutation.isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/${locale}/rcm-setup/billing-items`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
