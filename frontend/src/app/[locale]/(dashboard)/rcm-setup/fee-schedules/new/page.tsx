'use client';

import { useParams, useRouter } from 'next/navigation';
import { Table2 } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New fee schedule"
        subtitle="Define a price list and the period it applies"
        icon={Table2}
        breadcrumb={
          <Breadcrumb
            items={[
              { href: `/${locale}/rcm-setup`, label: 'RCM Setup' },
              { href: `/${locale}/rcm-setup/fee-schedules`, label: 'Fee schedules' },
              { label: 'New' },
            ]}
          />
        }
      />

      <FeeScheduleForm
        onSubmit={handleSubmit}
        isSubmitting={createSchedule.isPending}
        onCancel={() => router.push(`/${locale}/rcm-setup/fee-schedules`)}
      />
    </div>
  );
}
