'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { FeeScheduleForm } from '@/modules/rcm/components/fee-schedule-form';
import { useCreateFeeSchedule } from '@/modules/rcm/hooks/use-fee-schedules';
import type { CreateFeeScheduleInput } from '@/modules/rcm/types/fee-schedule';

export default function NewFeeSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const toast = useToast();
  const createSchedule = useCreateFeeSchedule();

  const handleSubmit = async (payload: CreateFeeScheduleInput) => {
    await createSchedule.mutateAsync(payload);
    toast({ title: 'Fee schedule created' });
    router.push(`/${locale}/rcm-setup/fee-schedules`);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${locale}/rcm-setup/fee-schedules`}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to fee schedules
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>New fee schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <FeeScheduleForm onSubmit={handleSubmit} isSubmitting={createSchedule.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
