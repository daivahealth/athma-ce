'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { InvoiceForm } from '@/modules/rcm/components/invoice-form';
import { useCreateInvoice } from '@/modules/rcm/hooks/use-invoices';
import type { CreateInvoiceInput } from '@/modules/rcm/types/invoice';

export default function NewInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createInvoice = useCreateInvoice();

  const handleSubmit = async (payload: CreateInvoiceInput) => {
    await createInvoice.mutateAsync(payload);
    toast({ title: 'Invoice created' });
    router.push(`/${locale}/invoices`);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/invoices`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to invoices
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm onSubmit={handleSubmit} isSubmitting={createInvoice.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
