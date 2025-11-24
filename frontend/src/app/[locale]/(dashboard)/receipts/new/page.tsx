'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ReceiptForm } from '@/modules/rcm/components/receipt-form';
import { useCreateReceipt } from '@/modules/rcm/hooks/use-receipts';
import type { CreateReceiptInput } from '@/modules/rcm/types/receipt';

export default function NewReceiptPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createReceipt = useCreateReceipt();

  const handleSubmit = async (payload: CreateReceiptInput) => {
    await createReceipt.mutateAsync(payload);
    toast({ title: 'Receipt created' });
    router.push(`/${locale}/receipts`);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/receipts`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to receipts
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <ReceiptForm onSubmit={handleSubmit} isSubmitting={createReceipt.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
